from enum import IntEnum  # Enum declarations
import json
from bc_proto_sdk import parse_eeg_data
import base64


class EegSampleRate(IntEnum):
    SR_NONE = 0x00
    SR_250Hz = 0x6F
    SR_500Hz = 0x5F
    SR_1000Hz = 0x4F
    SR_2000Hz = 0x3F
    SR_4000Hz = 0x2F
    SR_8000Hz = 0x1F
    SR_16000Hz = 0x0F


# SignalGain 枚举
class EegSignalGain(IntEnum):
    GAIN_NONE = 0x00
    GAIN_1 = 0x0F
    GAIN_2 = 0x1F
    GAIN_4 = 0x2F
    GAIN_6 = 0x3F
    GAIN_8 = 0x4F
    GAIN_12 = 0x5F
    GAIN_24 = 0x6F


# SignalSource 枚举
class SignalSource(IntEnum):
    SIGNAL_NONE = 0x00
    NORMAL = 0x0F
    SHORTED = 0x1F
    MVDD = 0x3F
    TEST_SIGNAL = 0x5F


class ImuSampleRate(IntEnum):
    SR_NONE = 0
    SR_50Hz = 1
    SR_100Hz = 2


class WiFiSecurity(IntEnum):
    SECURITY_NONE = 0
    SECURITY_OPEN = 1
    SECURITY_WPA2_AES_PSK = 2
    SECURITY_WPA2_TKIP_PSK = 3
    SECURITY_WPA2_MIXED_PSK = 4
    SECURITY_WPA_WPA2_TKIP_PSK = 5
    SECURITY_WPA_WPA2_AES_PSK = 6
    SECURITY_WPA_WPA2_MIXED_PSK = 7
    SECURITY_WPA3_AES_PSK = 8
    SECURITY_WPA2_WPA3_MIXED = 9


# 定义 EEGData 类
class EEGData:

    def __init__(self, timestamp, data_bytes, gain):
        self.timestamp = timestamp
        self.gain = gain
        # self.data = data_bytes
        self.data = parse_eeg_data(data_bytes, gain.value)

    @staticmethod
    def from_json(json_str, gain: EegSignalGain):
        json_obj = json.loads(json_str)
        eeg_data = json_obj["EEGCap"]["Mcu2App"]["eeg"]["data"]["sample1"]
        # TODO: currrent received sample1 data only
        timestamp = eeg_data["timestamp"]
        data_bytes = base64.b64decode(eeg_data["data"].encode("utf-8"))
        return EEGData(timestamp, data_bytes, gain)

    def __repr__(self):
        return f"EEGData(timestamp={self.timestamp}, eeg={list(self.data)})"


# def parse_eeg_data(self, data_bytes, gain_value):
#     # 解析 EEG 数据
#     buffer = []
#     for i in range(0, len(data_bytes), 3):
#         value = int.from_bytes(data_bytes[i : i + 3], byteorder="big", signed=True)
#         voltage = float(value) * (2 * 4.5 / gain_value) / (2**24)
#         buffer.append(voltage)
#     return buffer


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


def handle_message(py_message, logger):
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
            eeg_data = EEGData.from_json(message_bytes, EegSignalGain.GAIN_6)
            logger.info(f"eeg_data: {len(eeg_data.data)}")
            # logger.info(f"eeg_data: {eeg_data}")

        elif "imu" in message["EEGCap"]["Mcu2App"]:
            imu_data = IMUData.from_json(message_bytes)
            logger.info(f"imu_data: {imu_data}")

    else:
        logger.critical(f"received message: {message}")
