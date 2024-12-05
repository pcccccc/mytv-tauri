mod command;

// 根据平台配置移动入口点
#[cfg_attr(mobile, tauri::mobile_entry_point)]

// use crate::command::{create_window, execute_js};
use tauri::{generate_context, generate_handler, Builder, Manager, Window, WindowEvent};

// 窗口事件处理函数
// 该函数用于处理窗口的各种事件，如关闭请求等
// 参数:
// - app: &Window 类型的引用，代表当前应用的窗口
// - event: &WindowEvent 类型的引用，代表发生的窗口事件
fn window_event_handler(app: &Window, event: &WindowEvent) {
    match event {
        // 处理窗口关闭请求事件
        WindowEvent::CloseRequested { api, .. } => {
            // 阻止窗口直接关闭，以便进行自定义处理
            api.prevent_close();
            // 检查当前窗口是否为主窗口
            if app.label() == "Main" {
                // 子窗口 label 的数组
                const SUB_WINDOW_LABELS: [&str; 1] = ["sub_window"];
                // 遍历子窗口数组，尝试关闭所有子窗口
                for label in SUB_WINDOW_LABELS.iter() {
                    // 获取子窗口
                    let sub = app.get_webview_window(label);
                    // 如果子窗口存在，则销毁它
                    if sub.is_some() {
                        sub.unwrap().destroy().unwrap();
                    }
                }
            }
            // 销毁当前窗口
            app.destroy().unwrap();
        }
        // 其他事件类型暂不处理
        _ => {}
    }
}


// 定义应用程序的入口函数
pub fn run() {
    // 初始化应用程序构建器
    tauri::Builder::default()
        // 集成HTTP插件，用于网络请求
        .plugin(tauri_plugin_http::init())
        // 集成对话框插件，用于显示确认框、消息框等
        .plugin(tauri_plugin_dialog::init())
        // 集成SQL插件，用于数据库操作
        .plugin(tauri_plugin_sql::Builder::new().build())
        // 集成文件系统插件，用于文件操作
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        // 设置应用程序初始化配置
        .setup(|app| {
            // 在调试模式下集成日志插件
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            // 仅在调试构建时执行以下代码
            #[cfg(debug_assertions)]
            {
                // 获取主窗口
                let window = app.get_webview_window("main").unwrap();
                // 打开开发者工具
                window.open_devtools();
                // 关闭开发者工具
                window.close_devtools();
            }
            // 返回结果表示应用程序初始化成功
            Ok(())
        })
        // .invoke_handler(generate_handler![
        //   create_window,
        //   execute_js
        // ])
        // 运行应用程序
        .run(tauri::generate_context!())
        // 如果运行中出现错误，则输出错误信息
        .expect("error while running tauri application");
}

