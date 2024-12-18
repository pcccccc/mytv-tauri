mod command;

// 根据平台配置移动入口点
use crate::command::{create_browser_window, execute_js};
#[cfg_attr(mobile, tauri::mobile_entry_point)]
use tauri::{generate_context, generate_handler, Builder, Manager, Window, WindowEvent};
// 定义应用程序的入口函数
pub fn run() {
    // 初始化应用程序构建器
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
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
                        .level(log::LevelFilter::Debug)
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
        .invoke_handler(generate_handler![create_browser_window, execute_js])
        // 运行应用程序
        .run(generate_context!())
        // 如果运行中出现错误，则输出错误信息
        .expect("error while running tauri application");
}
