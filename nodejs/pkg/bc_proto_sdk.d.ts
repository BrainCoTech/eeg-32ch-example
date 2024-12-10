/* tslint:disable */
/* eslint-disable */
/**
 * @returns {any}
 */
export function start_eeg_stream(): any;
/**
 * @returns {any}
 */
export function stop_eeg_stream(): any;
/**
 * @returns {any}
 */
export function get_eeg_config(): any;
/**
 * @param {EegSampleRate} sr
 * @param {EegSignalGain} gain
 * @param {EegSignalSource} signal
 * @returns {any}
 */
export function set_eeg_config(sr: EegSampleRate, gain: EegSignalGain, signal: EegSignalSource): any;
/**
 * @returns {any}
 */
export function start_imu_stream(): any;
/**
 * @returns {any}
 */
export function stop_imu_stream(): any;
/**
 * @returns {any}
 */
export function get_imu_config(): any;
/**
 * @param {ImuSampleRate} sr
 * @returns {any}
 */
export function set_imu_config(sr: ImuSampleRate): any;
/**
 * @param {string} level
 */
export function init_logging(level: string): void;
/**
 * @param {Uint8Array} data
 * @param {number} gain
 * @returns {Float64Array}
 */
export function parse_eeg_data(data: Uint8Array, gain: number): Float64Array;
export enum EEGCapModuleId {
  MCU = 0,
  BLE = 1,
  APP = 2,
}
export enum EegSampleRate {
  SR_None = 0,
  SR_250Hz = 111,
  SR_500Hz = 95,
  SR_1000Hz = 79,
  SR_2000Hz = 63,
  SR_4000Hz = 47,
  SR_8000Hz = 31,
  SR_16000Hz = 15,
}
export enum EegSignalGain {
  GAIN_NONE = 0,
  GAIN_1 = 15,
  GAIN_2 = 31,
  GAIN_4 = 47,
  GAIN_6 = 63,
  GAIN_8 = 79,
  GAIN_12 = 95,
  GAIN_24 = 111,
}
export enum EegSignalSource {
  SIGNAL_NONE = 0,
  NORMAL = 15,
  SHORTED = 31,
  MVDD = 63,
  TEST_SIGNAL = 95,
}
export enum ImuSampleRate {
  SR_NONE = 0,
  SR_50Hz = 1,
  SR_100Hz = 2,
}
export enum MsgType {
  Crimson = 0,
  OxyZen = 1,
  Mobius = 3,
  MobiusV1_5 = 4,
  Almond = 5,
  AlmondV2 = 6,
  Morpheus = 2,
  Luna = 7,
  REN = 8,
  Breeze = 9,
  StarkUS = 10,
  EEGCap = 11,
  Edu = 12,
  Clear = 13,
  Melody = 15,
  Aura = 16,
}
export enum WiFiSecurity {
  SECURITY_NONE = 0,
  SECURITY_OPEN = 1,
  SECURITY_WPA2_AES_PSK = 2,
  SECURITY_WPA2_TKIP_PSK = 3,
  SECURITY_WPA2_MIXED_PSK = 4,
  SECURITY_WPA_WPA2_TKIP_PSK = 5,
  SECURITY_WPA_WPA2_AES_PSK = 6,
  SECURITY_WPA_WPA2_MIXED_PSK = 7,
  SECURITY_WPA3_AES_PSK = 8,
  SECURITY_WPA2_WPA3_MIXED = 9,
}
export class MessageParser {
  free(): void;
  /**
   * @param {string} device_id
   * @param {MsgType} msg_type
   */
  constructor(device_id: string, msg_type: MsgType);
  /**
   * @param {Uint8Array} data
   */
  receive_data(data: Uint8Array): void;
  /**
   * @returns {Promise<any>}
   */
  next_message(): Promise<any>;
}
