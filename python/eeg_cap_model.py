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


def perform_bandpass(
    data: list, order: int, low_cut: float, high_cut: float, fs: float
):
    return eeg_cap.apply_band_pass_filter(data, order, low_cut, high_cut, fs)


def perform_bandstop(
    data: list, order: int, low_cut: float, high_cut: float, fs: float
):
    return eeg_cap.apply_band_stop_filter(data, order, low_cut, high_cut, fs)


# 默认50Hz环境噪声滤波，fs=250Hz
def set_env_noise_filter_cfg(type, fs: float):
    return eeg_cap.set_env_noise_filter_cfg(type, fs)


def remove_env_noise(data: list):
    return eeg_cap.remove_env_noise(data)


# 定义 EEGData 类
class EEGData:
    @staticmethod
    def from_data(arr: bytes):
        return EEGData(arr[0], arr[1:])

    def __init__(self, timestamp, data):
        self.timestamp = timestamp
        self.data = data

    def __repr__(self):
        return f"EEGData(timestamp={self.timestamp}, data={list(self.data)})"


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
        print(json_obj)
        imu_data = json_obj["EEGCap"]["Mcu2App"]["imu"]["data"]
        # TODO: 兼容timestamp为空的情况，等待固件将timestamp字段加入
        timestamp = imu_data.get("timestamp", 0)
        accel = IMUCord.from_json(imu_data["accel"])
        gyro = IMUCord.from_json(imu_data["gyro"])
        mag = IMUCord.from_json(imu_data["mag"])
        return IMUData(timestamp, accel, gyro, mag)

    def __repr__(self):
        return f"IMUData(timestamp={self.timestamp}, acc={self.acc}, gyro={self.gyro}, mag={self.mag})"
