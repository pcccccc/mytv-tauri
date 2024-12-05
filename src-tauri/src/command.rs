use tauri::{AppHandle, Emitter, Manager, WebviewWindowBuilder};
use tauri_utils::config::{WebviewUrl, WindowConfig};

// 创建窗口
// 该异步函数用于创建一个新的窗口或重新创建一个已关闭的窗口
// 主要用途是响应应用程序中创建窗口的需求，例如在执行某些操作后需要打开新的界面
#[tauri::command]
pub async fn create_window(
    app_handle: AppHandle,
    label: String,
    url: String,
    option: WindowConfig,
) {
    // 检查是否存在具有相同标签的窗口，如果存在，则销毁它
    // let window_find = app_handle.get_webview_window(&label);
    // if window_find.is_some() {
    //     window_find.unwrap().destroy().unwrap();
    //     return;
    // }

    // 解析URL，准备用于新窗口的加载
    let url_parse = WebviewUrl::App(url.parse().unwrap());

    // 使用WebviewWindowBuilder创建新的窗口
    // 根据传入的配置选项设置窗口的属性
    WebviewWindowBuilder::new(&app_handle, &label, url_parse)
        .inner_size(option.width, option.height)
        .resizable(option.resizable)
        .visible(option.visible)
        .title(option.title)
        .center()
        .build()
        .unwrap();
}

/// 异步执行JavaScript代码
///
/// 该函数通过Tauri的命令装饰器导出，允许在前端调用此Rust函数来执行JavaScript代码
/// 它根据提供的标签获取对应的Web视图窗口，并在该窗口中执行给定的JavaScript代码
///
/// # 参数
///
/// * `app_handle`: Tauri的AppHandle实例，用于管理应用程序的生命周期和访问其窗口
/// * `label`: 字符串，表示目标Web视图窗口的标签
/// * `js`: 要执行的JavaScript代码字符串
#[tauri::command]
pub async fn execute_js(app_handle: AppHandle, label: String, js: String) {
    // 根据标签获取可能存在的Web视图窗口
    let window = app_handle.get_webview_window(&label);

    // 检查窗口是否存在，如果存在则执行JavaScript代码
    if window.is_some() {
        // 解包窗口并执行JavaScript代码，忽略执行结果
        window.unwrap().eval(&js).unwrap();
    }
    // 如果窗口不存在，则什么都不做
}

