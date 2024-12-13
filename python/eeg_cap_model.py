# from enum import IntEnum  # Enum declarations
import json
import base64
import bc_proto_sdk
eeg_cap = bc_proto_sdk.eeg_cap

# order: 4
def perform_highpass(data: list, order: int, high_cut: float, fs: float):
    return eeg_cap.apply_high_pass_filter(data, order, high_cut, fs)

def perform_lowpass(data: list, order: int, low_cut: float, fs: float):
    return eeg_cap.apply_low_pass_filter(data, order, low_cut, fs)

def perform_bandpass(data: list, order: int, low_cut: float, high_cut: float, fs: float):
    return eeg_cap.apply_band_pass_filter(data, order, low_cut, high_cut, fs)

def perform_bandstop(data: list, order: int, low_cut: float, high_cut: float, fs: float):
    return eeg_cap.apply_band_stop_filter(data, order, low_cut, high_cut, fs)

# 默认50Hz环境噪声滤波，fs=250Hz
def set_env_noise_filter_cfg(type, fs: float):
    return eeg_cap.set_env_noise_filter_cfg(type, fs)

def remove_env_noise(data: bytearray):
    return eeg_cap.remove_env_noise(data)

# 定义 EEGData 类
class EEGData:

    def __init__(
        self,
        timestamp,
        gain,
        sample1,
    ):
        self.timestamp = timestamp
        self.gain = gain
        self.sample1 = eeg_cap.parse_eeg_data(sample1, gain)
        

    @staticmethod
    def from_json(json_str, gain: int):
        json_obj = json.loads(json_str)
        sample1 = json_obj["EEGCap"]["Mcu2App"]["eeg"]["data"]["sample1"]

        timestamp = sample1["timestamp"]
        return EEGData(
            timestamp,
            gain,
            base64.b64decode(sample1["data"].encode("utf-8")),
        )

    def __repr__(self):
        return f"EEGData(timestamp={self.timestamp}, sample1={list(self.sample1)})"


class IMUCord:

    def __init__(self, cord_x, cord_y, cord_z):
        self.cord_x = cord_x
        self.cord_y = cord_y
        self.cord_z = cord_z

    @staticmethod
    def from_json(json_obj):
        return IMUCord(
            json_obj["cordX"],
            json_obj["cordY"],
            json_obj["cordZ"],
        )

    def __repr__(self):
        return f"IMUCord(cordX={self.cord_x}, cordY={self.cord_y}, cordZ={self.cord_z})"


class IMUData:

    def __init__(self, timestamp, acc, gyro, mag):
        self.timestamp = timestamp
        self.acc = acc
        self.gyro = gyro
        self.mag = mag

    @staticmethod
    def from_json(json_str):
        json_obj = json.loads(json_str)
        imu_data = json_obj["EEGCap"]["Mcu2App"]["imu"]["data"]
        # TODO: 兼容timestamp为空的情况，等待固件将timestamp字段加入
        timestamp = imu_data.get("timestamp", 0)
        accel = IMUCord.from_json(imu_data["accel"])
        gyro = IMUCord.from_json(imu_data["gyro"])
        mag = IMUCord.from_json(imu_data["mag"])
        return IMUData(timestamp, accel, gyro, mag)

    def __repr__(self):
        return f"IMUData(timestamp={self.timestamp}, acc={self.acc}, gyro={self.gyro}, mag={self.mag})"


def handle_message(py_message, logger, on_eeg_data=None, on_imu_data=None):
    if py_message is None:
        logger.warning(f"Received None")
        return

    if isinstance(py_message, str):
        logger.warning(f"Received error: {py_message}")
        return

    if not isinstance(py_message, bytes):
        logger.warning(f"Received not bytes: {py_message}")
        return

    message_bytes = py_message
    message = json.loads(message_bytes)

    # 检查是否EEG数据
    if "EEGCap" in message and "Mcu2App" in message["EEGCap"]:
        if (
            "eeg" in message["EEGCap"]["Mcu2App"]
            and "data" in message["EEGCap"]["Mcu2App"]["eeg"]
        ):
            gain = eeg_cap.EegSignalGain.GAIN_6  # default is GAIN_6 # TODO: updated by eeg cfg
            eeg_data = EEGData.from_json(message_bytes, gain)
            logger.info(f"eeg_data: {len(eeg_data.sample1)}")
            logger.debug(f"eeg_data: {eeg_data}")
            if on_eeg_data is not None:
                on_eeg_data(eeg_data)

        elif "imu" in message["EEGCap"]["Mcu2App"]:
            imu_data = IMUData.from_json(message_bytes)
            logger.info(f"imu_data: {imu_data}")

    else:
        logger.critical(f"received message: {message}")
