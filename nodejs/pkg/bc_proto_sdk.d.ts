/* tslint:disable */
/* eslint-disable */
export function fftfreq(n: number, d: number): Float64Array;
export function get_filtered_freq(n: number, fs: number): Float64Array;
export function get_filtered_fft(data: Float64Array, fs: number): Float64Array;
export function set_eeg_buffer_cfg(eeg_buffer_len: number): void;
export function set_imu_buffer_cfg(imu_buffer_len: number): void;
export function clear_eeg_buffer(): void;
export function clear_imu_buffer(): void;
export function clear_imp_eeg_buffers(): void;
export function init_logging(level: string): void;
export function set_web_callback(cb: Function): void;
export function parse_eeg_data(data: Uint8Array, gain: number): Float64Array;
export function get_device_info(): any;
export function start_eeg_stream(): any;
export function stop_eeg_stream(): any;
export function get_eeg_data_buffer(take: number, clean: boolean): any;
export function get_imu_data_buffer(take: number, clean: boolean): any;
export function get_eeg_config(): any;
export function set_eeg_config(sr: EegSampleRate, gain: EegSignalGain, signal: EegSignalSource): any;
export function get_leadoff_config(): any;
export function start_imu_stream(): any;
export function stop_imu_stream(): any;
export function get_imu_config(): any;
export function set_imu_config(sr: ImuSampleRate): any;
export function get_ble_device_info(): any;
export function set_ble_device_info(model: string, sn: string): any;
export function get_wifi_status(): any;
export function get_wifi_config(): any;
export function set_wifi_config(bandwidth_40mhz: boolean, security: WiFiSecurity, ssid: string, password: string): any;
export function send_start_dfu(file_size: number, file_md5: string, file_sha256: string): any;
export function send_dfu_data(offset: number, data: Uint8Array, finished: boolean): any;
export function send_dfu_reboot(): any;
export function set_env_noise_filter_cfg(noise_type: NoiseTypes, fs: number): void;
export function remove_env_noise(data: Float64Array, channel: number): Float64Array;
export function set_eeg_filter_cfg(high_pass_enabled: boolean, high_cut: number, low_pass_enabled: boolean, low_cut: number, band_pass_enabled: boolean, band_pass_low: number, band_pass_high: number, band_stop_enabled: boolean, band_stop_low: number, band_stop_high: number, fs: number): void;
export function apply_eeg_filters(data: Float64Array, channel: number): Float64Array;
export function apply_highpass(filter: HighPassFilter, data: Float64Array): Float64Array;
export function apply_lowpass(filter: LowPassFilter, data: Float64Array): Float64Array;
export function apply_bandpass(filter: BandPassFilter, data: Float64Array): Float64Array;
export function apply_bandstop(filter: BandStopFilter, data: Float64Array): Float64Array;
export function set_msg_resp_callback(callback: Function): void;
export function set_tcp_write_callback(callback: Function): void;
export function start_leadoff_check(loop_check: boolean, freq: LeadOffFreq, current: LeadOffCurrent, impedance_callback: Function): void;
export function stop_leadoff_check(): void;
export enum ActionCmd {
  SetStart = 1,
  SetFinish = 2,
  ReadStart = 3,
  ReadFinish = 4,
  Save = 5,
  Run = 6,
}
export enum ActionSequenceId {
  DefaultGestureOpen = 1,
  DefaultGestureFist = 2,
  DefaultGesturePinchTwo = 3,
  DefaultGesturePinchThree = 4,
  DefaultGesturePinchSide = 5,
  DefaultGesturePoint = 6,
  CustomGesture1 = 10,
  CustomGesture2 = 11,
  CustomGesture3 = 12,
  CustomGesture4 = 13,
  CustomGesture5 = 14,
  CustomGesture6 = 15,
}
export enum ActionStatus {
  Idle = 0,
  Running = 1,
  Completed = 2,
  Error = 3,
}
export enum AggOperations {
  Mean = 0,
  Median = 1,
}
export enum Baudrate {
  Baud115200 = 0,
  Baud57600 = 1,
  Baud19200 = 2,
  Baud460800 = 3,
}
export enum DfuState {
  Idle = 0,
  Starting = 1,
  Started = 2,
  Transfer = 3,
  Completed = 4,
  Aborted = 5,
}
export enum DownsamplingOperations {
  Mean = 0,
  Median = 1,
  Max = 2,
  Min = 3,
  Sum = 4,
  First = 5,
  Last = 6,
  Extremes = 7,
}
export enum EEGCapModuleId {
  MCU = 0,
  BLE = 1,
  APP = 2,
}
export enum EduModuleId {
  APP = 1,
  DONGLE = 2,
  DEVICE = 3,
}
export enum EegSampleRate {
  SR_None = 0,
  SR_250Hz = 1,
  SR_500Hz = 2,
  SR_1000Hz = 3,
  SR_2000Hz = 4,
}
export enum EegSignalGain {
  GAIN_NONE = 0,
  GAIN_1 = 1,
  GAIN_2 = 2,
  GAIN_4 = 3,
  GAIN_6 = 4,
  GAIN_8 = 5,
  GAIN_12 = 6,
  GAIN_24 = 7,
}
export enum EegSignalSource {
  SIGNAL_NONE = 0,
  NORMAL = 1,
  SHORTED = 2,
  MVDD = 3,
  TEST_SIGNAL = 4,
}
export enum FingerId {
  Thumb = 1,
  ThumbAux = 2,
  Index = 3,
  Middle = 4,
  Ring = 5,
  Pinky = 6,
}
export enum ForceLevel {
  Small = 1,
  Normal = 2,
  Full = 3,
}
export enum ImuSampleRate {
  SR_NONE = 0,
  SR_50Hz = 1,
  SR_100Hz = 2,
}
export enum LeadOffChip {
  None = 0,
  Chip1 = 1,
  Chip2 = 2,
  Chip3 = 3,
  Chip4 = 4,
}
export enum LeadOffCurrent {
  None = 0,
  Cur6nA = 1,
  Cur24nA = 2,
  Cur6uA = 3,
  Cur24uA = 4,
}
export enum LeadOffFreq {
  None = 0,
  Dc = 1,
  Ac7p8hz = 2,
  Ac31p2hz = 3,
  AcFdr4 = 4,
}
export enum LedColor {
  Unchanged = 0,
  R = 1,
  G = 2,
  RG = 3,
  B = 4,
  RB = 5,
  GB = 6,
  RGB = 7,
}
export enum LedMode {
  None = 0,
  Shutdown = 1,
  Keep = 2,
  Blink = 3,
  OneShot = 4,
  Blink0_5Hz = 5,
  Blink2Hz = 6,
}
export enum MotorState {
  Idle = 0,
  Running = 1,
  Stall = 2,
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
  Stark = 10,
  EEGCap = 11,
  Edu = 12,
  Clear = 13,
  Melody = 15,
  Aura = 16,
}
export enum NoiseTypes {
  FIFTY = 0,
  SIXTY = 1,
  FIFTY_AND_SIXTY = 2,
}
export enum PressState {
  None = 0,
  Down = 1,
  Up = 2,
}
export enum RegisterAddress {
  SetOta = 900,
  SkuType = 901,
  SetFactoryKey = 910,
  SetSn = 920,
  StallDuration = 936,
  PwmSmall = 942,
  PwmNormal = 948,
  PwmFull = 954,
  StallCurrentSmall = 960,
  StallCurrentNormal = 966,
  StallCurrentFull = 972,
  DeviceId = 1000,
  Baudrate = 1001,
  Force = 1002,
  SetReboot = 1009,
  Position = 1010,
  Speed = 1016,
  Led = 1022,
  Current = 1023,
  Turbo = 1030,
  TurboInterval = 1031,
  TurboDuration = 1032,
  AutoCalibration = 1033,
  ManualCalibration = 1034,
  ActionCmd = 1098,
  ActionNum = 1099,
  ActionData = 1100,
  GetNowPosition = 2000,
  GetNowSpeed = 2006,
  GetNowCurrent = 2012,
  GetMotorState = 2018,
  GetVoltage = 2024,
  GetButtonStatus = 2025,
  GetFwVersion = 3000,
  GetSn = 3010,
  GetThumbNormalForce1 = 4000,
  GetThumbTangentialForce1 = 4001,
  GetThumbTangentialDirection1 = 4002,
  GetThumbNormalForce2 = 4003,
  GetThumbTangentialForce2 = 4004,
  GetThumbTangentialDirection2 = 4005,
  GetThumbSelfClose1 = 4006,
  GetThumbStatus = 4008,
  GetIndexNormalForce1 = 4009,
  GetIndexTangentialForce1 = 4010,
  GetIndexTangentialDirection1 = 4011,
  GetIndexNormalForce2 = 4012,
  GetIndexTangentialForce2 = 4013,
  GetIndexTangentialDirection2 = 4014,
  GetIndexNormalForce3 = 4015,
  GetIndexTangentialForce3 = 4016,
  GetIndexTangentialDirection3 = 4017,
  GetIndexSelfClose1 = 4018,
  GetIndexSelfClose2 = 4020,
  GetIndexMutualClose = 4022,
  GetIndexStatus = 4024,
  GetMiddleNormalForce1 = 4025,
  GetMiddleTangentialForce1 = 4026,
  GetMiddleTangentialDirection1 = 4027,
  GetMiddleNormalForce2 = 4028,
  GetMiddleTangentialForce2 = 4029,
  GetMiddleTangentialDirection2 = 4030,
  GetMiddleNormalForce3 = 4031,
  GetMiddleTangentialForce3 = 4032,
  GetMiddleTangentialDirection3 = 4033,
  GetMiddleSelfClose1 = 4034,
  GetMiddleSelfClose2 = 4036,
  GetMiddleMutualClose = 4038,
  GetMiddleStatus = 4040,
  GetRingNormalForce1 = 4041,
  GetRingTangentialForce1 = 4042,
  GetRingTangentialDirection1 = 4043,
  GetRingNormalForce2 = 4044,
  GetRingTangentialForce2 = 4045,
  GetRingTangentialDirection2 = 4046,
  GetRingNormalForce3 = 4047,
  GetRingTangentialForce3 = 4048,
  GetRingTangentialDirection3 = 4049,
  GetRingSelfClose1 = 4050,
  GetRingSelfClose2 = 4052,
  GetRingMutualClose = 4054,
  GetRingStatus = 4056,
  GetPinkyNormalForce1 = 4057,
  GetPinkyTangentialForce1 = 4058,
  GetPinkyTangentialDirection1 = 4059,
  GetPinkyNormalForce2 = 4060,
  GetPinkyTangentialForce2 = 4061,
  GetPinkyTangentialDirection2 = 4062,
  GetPinkySelfClose1 = 4063,
  GetPinkyMutualClose1 = 4065,
  GetPinkyStatus = 4067,
  SetThumbReset = 4100,
  SetIndexReset = 4101,
  SetMiddleReset = 4102,
  SetRingReset = 4103,
  SetPinkyReset = 4104,
  SetThumbCalibration = 4105,
  SetIndexCalibration = 4106,
  SetMiddleCalibration = 4107,
  SetRingCalibration = 4108,
  SetPinkyCalibration = 4109,
  GetTouchFwVersion = 4200,
}
export enum SkuType {
  MediumRight = 1,
  MediumLeft = 2,
  SmallRight = 3,
  SmallLeft = 4,
}
export enum StarkError {
  None = 0,
  Unknown = 1,
  InvalidParams = 2,
  InvalidData = 3,
  ParseFailed = 4,
  AllocFailed = 5,
  ReadFailed = 6,
  OperationFailed = 7,
  SystemIsBusy = 11,
}
export enum StarkModuleId {
  MCU = 1,
  MTR = 2,
  APP = 3,
  SERIAL = 4,
}
export enum WiFiSecurity {
  SECURITY_NONE = 0,
  SECURITY_OPEN = 1,
  SECURITY_WPA2_MIXED_PSK = 2,
}
export class ActionSequence {
  free(): void;
  constructor(action_id: ActionSequenceId, data: (ActionSequenceItem)[]);
  description(): string;
  action_id: ActionSequenceId;
  data: (ActionSequenceItem)[];
}
export class ActionSequenceItem {
  free(): void;
  constructor(index: number, duration: number, positions: Uint16Array, speeds: Int16Array, strengths: Int16Array);
  description(): string;
  desc(): string;
  index: number;
  duration: number;
  positions: Uint16Array;
  speeds: Int16Array;
  strengths: Int16Array;
}
export class BandPassFilter {
  free(): void;
  constructor(_order: number, s: number, fl: number, fu: number);
  a: number;
  d1: number;
  d2: number;
  d3: number;
  d4: number;
  w0: number;
  w1: number;
  w2: number;
  w3: number;
  w4: number;
}
export class BandStopFilter {
  free(): void;
  constructor(_order: number, s: number, fl: number, fu: number);
  a: number;
  d1: number;
  d2: number;
  d3: number;
  d4: number;
  w0: number;
  w1: number;
  w2: number;
  w3: number;
  w4: number;
  r: number;
  s: number;
}
export class ButtonPressEvent {
  free(): void;
  constructor(timestamp: number, button_id: number, press_state: PressState);
  description(): string;
  timestamp: number;
  button_id: number;
  press_state: PressState;
}
export class DeviceInfo {
  free(): void;
  constructor(sku_type: SkuType, serial_number: string, firmware_version: string);
  desc(): string;
  description(): string;
  /**
   * Hand SKU
   */
  sku_type: SkuType;
  /**
   * Serial number
   */
  serial_number: string;
  /**
   * Firmware version
   */
  firmware_version: string;
}
export class HighPassFilter {
  free(): void;
  constructor(_order: number, s: number, f: number);
}
export class LedInfo {
  free(): void;
  constructor(color: LedColor, mode: LedMode);
  description(): string;
  color: LedColor;
  mode: LedMode;
}
export class LowPassFilter {
  free(): void;
  constructor(_order: number, s: number, f: number);
}
export class MessageParser {
  free(): void;
  constructor(device_id: string, msg_type: MsgType);
  receive_data(data: Uint8Array): void;
  next_message(): Promise<any>;
  start_message_stream(): Promise<any>;
}
export class MotorStatusData {
  free(): void;
  constructor(positions: Uint8Array, speeds: Int8Array, currents: Int8Array, states: Uint8Array);
  is_idle(): boolean;
  is_opened(): boolean;
  is_closed(): boolean;
  desc(): string;
  description(): string;
  /**
   * Motor positions, [u8; 6]
   */
  positions: Uint8Array;
  /**
   * Motor speed
   */
  speeds: Int8Array;
  /**
   * Motor PWM
   * Motor state
   */
  states: any[];
}
export class SerialPortCfg {
  free(): void;
  constructor(slave_id: number, baudrate: Baudrate);
  description(): string;
  /**
   * Slave ID for the protocol
   * - For Protobuf protocol: range 10~254, default is 10, 254 is the broadcast address
   * - For Modbus protocol: range 0~254, default is 1, 0 is the broadcast address (broadcast is only for control commands)
   */
  slave_id: number;
  /**
   * Baud rate for the serial communication
   */
  baudrate: Baudrate;
}
export class SosFilter {
  private constructor();
  free(): void;
}
export class StarkOTA {
  free(): void;
  constructor();
  get_dfu_state(): DfuState;
  is_dfu_available(): boolean;
  set_dfu_state_callback(cb: Function): void;
  set_dfu_progress_callback(cb: Function): void;
  trigger_dfu_state(state: DfuState): Promise<void>;
  trigger_dfu_progress(progress: number): Promise<void>;
  dfu_state: DfuState;
}
export class StarkSDK {
  private constructor();
  free(): void;
  static init(is_modbus?: boolean, level?: string): void;
  static get_sdk_version(): string;
  /**
   * 接收数据
   *
   * # 参数
   * - `slave_id`: 设备的从属 ID
   * - `data`: 接收到的数据
   */
  static did_receive_data(slave_id: number, data: Uint8Array): void;
  static get_device_info(slave_id: number): Promise<Promise<any>>;
  static get_device_sn(slave_id: number): Promise<Promise<any>>;
  static get_device_fw_version(slave_id: number): Promise<Promise<any>>;
  static get_sku_type(slave_id: number): Promise<Promise<any>>;
  static get_serial_port_cfg(slave_id: number): Promise<Promise<any>>;
  static get_serial_baudrate(slave_id: number): Promise<Promise<any>>;
  static get_force_level(slave_id: number): Promise<Promise<any>>;
  static get_voltage(slave_id: number): Promise<Promise<any>>;
  static get_auto_calibration_enabled(slave_id: number): Promise<Promise<any>>;
  static get_turbo_mode_enabled(slave_id: number): Promise<Promise<any>>;
  static get_turbo_config(slave_id: number): Promise<Promise<any>>;
  static get_led_info(slave_id: number): Promise<Promise<any>>;
  static get_button_event(slave_id: number): Promise<Promise<any>>;
  static get_motor_state(slave_id: number): Promise<Promise<any>>;
  static get_finger_positions(slave_id: number): Promise<Promise<any>>;
  static get_finger_speeds(slave_id: number): Promise<Promise<any>>;
  static get_finger_currents(slave_id: number): Promise<Promise<any>>;
  static get_action_sequence(slave_id: number, action_id: ActionSequenceId): Promise<Promise<any>>;
  static set_action_cmd(slave_id: number, action_id: ActionSequenceId, cmd: ActionCmd): Promise<any>;
  static save_action_sequence(slave_id: number, action_id: ActionSequenceId): Promise<Promise<any>>;
  static run_action_sequence(slave_id: number, action_id: ActionSequenceId): Promise<Promise<any>>;
  static transfer_action_sequence(slave_id: number, action_id: ActionSequenceId, sequences: Array<any>): Promise<Promise<any>>;
  static reboot(slave_id: number): Promise<void>;
  /**
   * 设置串口波特率
   * 注意：更新串口配置后设备将重启
   *
   * # 参数
   * - `baudrate`: 波特率值
   */
  static set_serialport_baudrate(slave_id: number, baudrate: Baudrate): Promise<Promise<any>>;
  /**
   * 设置设备 ID
   * 注意：更新设备 ID 后设备将重启
   *
   * # 参数
   * - `new_slave_id`: 新的设备 ID
   */
  static set_serialport_device_id(slave_id: number, new_slave_id: number): Promise<Promise<any>>;
  static set_force_level(slave_id: number, force_level: ForceLevel): Promise<Promise<any>>;
  static set_position_auto_calibration(slave_id: number, enabled: boolean): Promise<Promise<any>>;
  static set_position_calibration(slave_id: number): Promise<Promise<any>>;
  static set_turbo_mode_enabled(slave_id: number, enabled: boolean): Promise<Promise<any>>;
  static set_turbo_config(slave_id: number, turbo_conf: TurboConfig): Promise<Promise<any>>;
  static set_led_info(slave_id: number, led_info: LedInfo): Promise<Promise<any>>;
  static set_finger_position(slave_id: number, position: number): Promise<Promise<any>>;
  static set_finger_positions(slave_id: number, positions: Uint16Array): Promise<Promise<any>>;
  static set_finger_speed(slave_id: number, speed: number): Promise<Promise<any>>;
  static set_finger_speeds(slave_id: number, speeds: Int16Array): Promise<Promise<any>>;
  /**
   * Factory Functions
   */
  static factory_set_key(slave_id: number, operation_key: string): Promise<Promise<any>>;
  static factory_set_device_sn(slave_id: number, sn: string): Promise<Promise<any>>;
  static factory_set_sku_type(slave_id: number, hand_type: SkuType): Promise<Promise<any>>;
  static factory_set_stall_durations(slave_id: number, durations: Uint16Array): Promise<Promise<any>>;
  static factory_set_stall_currents(slave_id: number, level: ForceLevel, currents: Uint16Array): Promise<Promise<any>>;
  static factory_set_finger_pwms(slave_id: number, level: ForceLevel, pwms: Uint16Array): Promise<Promise<any>>;
  static factory_get_stall_durations(slave_id: number): Promise<Promise<any>>;
  static factory_get_stall_currents(slave_id: number, level: ForceLevel): Promise<Promise<any>>;
  static factory_get_finger_pwms(slave_id: number, level: ForceLevel): Promise<Promise<any>>;
}
export class TouchSensorStatus {
  free(): void;
  constructor(normal_force1: number, normal_force2: number, normal_force3: number, tangential_force1: number, tangential_force2: number, tangential_force3: number, tangential_direction1: number, tangential_direction2: number, tangential_direction3: number, self_close1: number, self_close2: number, mutual_close: number, status: number);
  normal_force1(): number;
  normal_force2(): number;
  normal_force3(): number;
  tangential_force1(): number;
  tangential_force2(): number;
  tangential_force3(): number;
  tangential_direction1(): number;
  tangential_direction2(): number;
  tangential_direction3(): number;
  self_close1(): number;
  self_close2(): number;
  mutual_close(): number;
  status(): number;
  is_normal(): boolean;
  is_abnormal(): boolean;
  description(): string;
  normal_force1: number;
  normal_force2: number;
  normal_force3: number;
  tangential_force1: number;
  tangential_force2: number;
  tangential_force3: number;
  tangential_direction1: number;
  tangential_direction2: number;
  tangential_direction3: number;
  self_close1: number;
  self_close2: number;
  mutual_close: number;
  status: number;
}
export class TurboConfig {
  free(): void;
  constructor(interval: number, duration: number);
  interval(): number;
  duration(): number;
  description(): string;
  interval: number;
  duration: number;
}
