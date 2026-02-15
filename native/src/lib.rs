#![deny(clippy::all)]

use napi_derive::napi;

/// Returns the native addon version (for sanity check / no-fallback requirement).
#[napi]
pub fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}
