/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function start_eeg_stream(): number;
export function stop_eeg_stream(): number;
export function get_eeg_config(): number;
export function set_eeg_config(a: number, b: number, c: number): number;
export function start_imu_stream(): number;
export function stop_imu_stream(): number;
export function get_imu_config(): number;
export function set_imu_config(a: number): number;
export function init_logging(a: number, b: number): void;
export function __wbg_messageparser_free(a: number, b: number): void;
export function messageparser_new(a: number, b: number, c: number): number;
export function messageparser_receive_data(a: number, b: number, c: number): void;
export function messageparser_next_message(a: number): number;
export function parse_eeg_data(a: number, b: number, c: number, d: number): void;
export const __wbindgen_export_0: WebAssembly.Table;
export function __wbindgen_export_1(a: number, b: number, c: number): void;
export function __wbindgen_export_2(a: number, b: number): number;
export function __wbindgen_export_3(a: number, b: number, c: number, d: number): number;
export function __wbindgen_add_to_stack_pointer(a: number): number;
export function __wbindgen_export_4(a: number, b: number, c: number): void;
export function __wbindgen_export_5(a: number): void;
export function __wbindgen_export_6(a: number, b: number, c: number, d: number): void;
