import logging
import asyncio
from bc_proto_sdk import MessageParser, MsgType, NoiseTypes
from logger import getLogger
from eeg_cap_model import (
    eeg_cap,
    EEGData,
    IMUData,
    set_env_noise_filter_cfg,
    set_eeg_buffer_length,
    set_imu_buffer_length,
)
import matplotlib.pyplot as plt
import numpy as np

logger = getLogger(logging.DEBUG)
# logger = getLogger(logging.INFO)


def on_eeg_data(eeg_data):
    logger.info(f"Received EEG data, eeg_data={eeg_data}")
    logger.info(f"Received EEG data, {type(eeg_data)}")


def mock_recv_data(parser):
    logger.debug("Starting receiving data")

    # fmt: off
    msgs = [
        # Device info
        [0x42, 0x52, 0x4e, 0x43, 0x02, 0x0b, 0x27, 0x00, 0x00, 0x02, 0x00, 0x08, 0x02, 0x32, 0x23, 0x0a, 0x05, 0x45, 0x45, 0x47, 0x33, 0x32, 0x12, 0x0c, 0x45, 0x45, 0x47, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x22, 0x05, 0x31, 0x2e, 0x30, 0x2e, 0x30, 0x2a, 0x05, 0x30, 0x2e, 0x30, 0x2e, 0x36, 0xb1, 0x8c],
        # empty response
        [0x42, 0x52, 0x4e, 0x43, 0x02, 0x0b, 0x02, 0x00, 0x00, 0x02, 0x00, 0x08, 0x02, 0xac, 0x36],
        # EEG config
        [0x42, 0x52, 0x4e, 0x43, 0x02, 0x0b, 0x0c, 0x00, 0x00, 0x02, 0x00, 0x08, 0x03, 0x1a, 0x08, 0x0a, 0x06, 0x08, 0x6f, 0x10, 0x3f, 0x18, 0x0f, 0xd2, 0x00],
        # IMU config
        [0x42, 0x52, 0x4e, 0x43, 0x02, 0x0b, 0x08, 0x00, 0x00, 0x02, 0x00, 0x08, 0x03, 0x22, 0x04, 0x0a, 0x02, 0x08, 0x01, 0x4b, 0xf8],
    ]
    
    for msg in msgs:
        parser.receive_data(bytes(msg))

    # read from file 
    # with open("eeg_cap_sample_eeg.log", "r") as f:
    #     for line in f:
    #         parser.receive_data(bytes([int(x, 16) for x in line.strip().split(", ")]))

    with open("eeg_cap_sample_imu.log", "r") as f:
        for line in f:
            parser.receive_data(bytes([int(x, 16) for x in line.strip().split(", ")]))
    
    logger.debug("Finished receiving data")


# EEG数据
fs = 250  # 采样频率
num_channels = 32  # 通道数
eeg_buffer_length = 1000  # 默认缓冲区长度, 1000个数据点，每个数据点有32个通道，每个通道的值类型为float32，即4字节，大约占用128KB内存, 1000 * 32 * 4 = 128000 bytes
eeg_seq_num = None  # EEG数据包序号
eeg_values = np.zeros((num_channels, eeg_buffer_length))  # 32通道的EEG数据

# 滤波器参数设置
order = 4  # 滤波器阶数
low_cut = 2  # 低通滤波截止频率
high_cut = 45  # 高通滤波截止频率

# IMU数据
imu_buffer_length = 1000  # 默认缓冲区长度, 1000个数据点


def init_cfg():
    logger.info("Init cfg")
    set_env_noise_filter_cfg(NoiseTypes.FIFTY, fs)  # 滤波器参数设置，去除50Hz电流干扰
    set_eeg_buffer_length(eeg_buffer_length)  # 设置EEG数据缓冲区长度
    set_imu_buffer_length(imu_buffer_length)  # 设置IMU数据缓冲区长度


### main.py
async def main():
    init_cfg()

    # set callback
    # eeg_cap.set_eeg_data_callback(on_eeg_data)

    parser = MessageParser("mock-eeg-cap-device", MsgType.EEGCap)
    await parser.start_message_stream()
    mock_recv_data(parser)

    await asyncio.sleep(0.5)

    eeg_result = []
    fetch_num = 1000
    eeg_buff = eeg_cap.get_eeg_buffer(fetch_num, False)
    for i in range(len(eeg_buff)):
        eeg_result.append(EEGData.from_data(eeg_buff[i]))

    result_str = "\n\t".join(map(str, eeg_result))
    logger.info(f"Got EEG buffer result:\n\t{result_str}")

    imu_buff = eeg_cap.get_imu_buffer(fetch_num, False)
    imu_result = []
    for i in range(len(imu_buff)):
        imu_result.append(IMUData.from_data(imu_buff[i]))
        
    result_str = "\n\t".join(map(str, imu_result))
    logger.info(f"Got IMU buffer result:\n\t{result_str}")

    await asyncio.sleep(1)
    logger.info("Done")


asyncio.run(main())
