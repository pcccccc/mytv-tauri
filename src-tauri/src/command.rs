use log::debug;
use serde::{Deserialize, Serialize};
use tauri::webview::PageLoadEvent;
use tauri::{AppHandle, Emitter, EventTarget, Manager, WebviewWindowBuilder};
use tauri::EventTarget::Window;
use tauri_utils::config::{WebviewUrl, WindowConfig};
use crate::run;
// 创建窗口

#[derive(Serialize)]
struct PageLoadedData {
    label: String,
    info: String,
}
#[tauri::command]
pub async fn create_browser_window(
    app_handle: AppHandle,
    label: String,
    url: String,
    option: WindowConfig,
    info: String,
) {
    //let url_parse = WebviewUrl::App(url.parse().unwrap());
    let window =  if let Some(window) = app_handle.get_webview_window(&label) {
        window.eval(&format!(r#"document.location = "{url}""#));
        window
    } else {
        let url_parse = WebviewUrl::App(url.parse().unwrap());
        let clone_app_handle = app_handle.clone();
        WebviewWindowBuilder::new(&app_handle, &label, url_parse)
            .inner_size(option.width, option.height)
            .resizable(option.resizable)
            .visible(option.visible)
            .title(option.title)
            .center()
            .on_page_load(move |window, payload| match payload.event() {
                PageLoadEvent::Finished => {
                    let data = PageLoadedData {
                        label: label.clone(),
                        info: info.clone(),
                    };
                    debug!("page[{url}] load done");
                    let _ = clone_app_handle.emit("page-loaded-event", &data);
                }
                _ => {}
            })
            
            .build()
            .unwrap()
    };
    window.on_window_event({
        let win = window.clone();
        move|event| {
            match event {
                tauri::WindowEvent::Destroyed => {
                    debug!("windows[{}] closed",win.title().as_deref().unwrap_or("<unknown>"))
                }
                _ => {}
            }
        }
    })
}

// 执行 js
#[tauri::command]
pub async fn execute_js(app_handle: AppHandle, label: String, js: String) {
    let window = app_handle.get_webview_window(&label);
    if window.is_some() {
        window.unwrap().eval(&js).unwrap();
    }
}
