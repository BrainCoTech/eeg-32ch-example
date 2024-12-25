# from enum import IntEnum  # Enum declarations
import json
# import base64
import bc_proto_sdk
eeg_cap = bc_proto_sdk.eeg_cap


# order: 4
def perform_highpass(data: list, order: int, high_cut: float, fs: float):
    return eeg_cap.apply_highpass_filter(data, order, high_cut, fs)

def perform_lowpass(data: list, order: int, low_cut: float, fs: float):
    return eeg_cap.apply_lowpass_filter(data, order, low_cut, fs)

def perform_bandpass(data: list, order: int, low_cut: float, high_cut: float, fs: float):
    return eeg_cap.apply_bandpass_filter(data, order, low_cut, high_cut, fs)

def perform_bandstop(data: list, order: int, low_cut: float, high_cut: float, fs: float):
    return eeg_cap.apply_bandstop_filter(data, order, low_cut, high_cut, fs)

# 默认50Hz环境噪声滤波，fs=250Hz
def set_env_noise_filter_cfg(type, fs: float):
    return eeg_cap.set_env_noise_filter_cfg(type, fs)

def remove_env_noise(data: list):
    return eeg_cap.remove_env_noise(data)

def set_eeg_buffer_length(len: int):
    return eeg_cap.set_eeg_buffer_cfg(len)

def set_imu_buffer_length(len: int):
    return eeg_cap.set_imu_buffer_cfg(len)

# 定义 EEGData 类
class EEGData:
    @staticmethod
    def from_data(arr: bytes):
        return EEGData(arr[0], arr[1:])

    def __init__(self, timestamp, channel_values):
        self.timestamp = timestamp
        self.channel_values = channel_values

    def __repr__(self):
        return f"timestamp={self.timestamp}, len={len(self.channel_values)}"
        # return f"EEGData(timestamp={self.timestamp}, channel_values={list(self.channel_values)})"


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
    @staticmethod
    def from_data(arr: bytes):
        return IMUData(arr[0], arr[1:4], arr[4:7], arr[7:])
    
    def __init__(self, timestamp, acc, gyro, mag):
        self.timestamp = timestamp
        self.acc = IMUCord(acc[0], acc[1], acc[2])
        self.gyro = IMUCord(gyro[0], gyro[1], gyro[2])
        self.mag = IMUCord(mag[0], mag[1], mag[2])

    def __repr__(self):
        # return f"imu timestamp={self.timestamp}"
        return f"IMUData(timestamp={self.timestamp}, acc={self.acc}, gyro={self.gyro}, mag={self.mag})"