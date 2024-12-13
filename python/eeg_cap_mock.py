import logging
import asyncio
from bc_proto_sdk import MessageParser, MsgType, NoiseTypes
from logger import getLogger
from eeg_cap_model import handle_message, perform_bandpass, remove_env_noise, set_env_noise_filter_cfg
# import scipy.signal as signal
import matplotlib.pyplot as plt
import numpy as np

logger = getLogger(logging.DEBUG)
# logger = getLogger(logging.INFO)

# 设定参数
fs = 250  # 采样频率
order = 4  # 滤波器阶数
low_cut = 2  # 低通滤波截止频率
high_cut = 45  # 高通滤波截止频率
edge = 10

# 32通道的EEG数据，二维数组
eeg_values = [[] for _ in range(32)]

def draw_eeg_data():
    global eeg_values
    plt.figure(figsize=(20, 15))
    for i in range(32):
        plt.subplot(8, 4, i + 1)  # 创建8行4列的子图
        data = eeg_values[i]
        logger.debug(f"Raw data for channel {i}, {data}")
        
        # 检查数据长度是否满足要求
        if len(data) > edge:  # 假设 edge 是 remove_env_noise 函数的最小数据长度要求
            data = remove_env_noise(data)
            data = perform_bandpass(data, order, low_cut, high_cut, fs)
            logger.debug(f"Drawing Filter data for channel {i}, {data}")
        else:
            logger.warning(f"Data length for channel {i} is too short for noise removal")
        
        plt.plot(data, label=f"EEG Channel {i}")
        plt.legend()
        plt.xlabel("Time [s]")
        plt.ylabel("Amplitude")
        plt.title(f"EEG Channel {i}")
        plt.grid(True)
    plt.tight_layout()  # 调整子图间距
    plt.show()

counter = 0
def on_eeg_data(eeg_data):
    # logger.debug(f"Received EEG data, {type(eeg_data.sample1)}")
    # eeg_data.sample1 长度为32，每个元素是一个通道的数据
    for i in range(32):
        eeg_values[i].append(eeg_data.sample1[i])
        # 每个通道最大保存1000个数据  
        if len(eeg_values[i]) > 1000:
                eeg_values[i] = eeg_values[i][-1000:]
            
    global counter
    counter += 1
    if counter % 2 == 0:
        plt.clf()  # 清除当前图像
        draw_eeg_data()

### main.py
async def main():
    parser = MessageParser("mock-eeg-cap-device", MsgType.EEGCap)
    message_stream = parser.get_message_stream()

    set_env_noise_filter_cfg(NoiseTypes.FIFTY, fs)

    logger.debug("Starting receiving data")

    # fmt: off
    # EEG data
    parser.receive_data(bytes([66, 82, 78, 67, 2, 11, 121, 0, 0, 2, 0, 8, 1, 26, 117, 18, 115, 10, 113, 8, 213, 8, 18, 108,
        192, 0, 0, 17, 177, 229, 17, 176, 135, 17, 181, 47, 17, 189, 18, 17, 191, 248, 17, 184, 115,
        17, 192, 86, 17, 194, 105, 192, 0, 0, 219, 237, 13, 221, 144, 42, 15, 77, 164, 13, 9, 104, 219,
        221, 63, 217, 90, 108, 13, 27, 136, 13, 90, 223, 192, 0, 0, 13, 0, 65, 12, 234, 68, 17, 188,
        254, 13, 219, 151, 12, 221, 3, 13, 18, 253, 16, 175, 80, 13, 14, 152, 192, 0, 0, 13, 28, 40,
        13, 2, 123, 13, 28, 153, 13, 3, 246, 13, 40, 144, 12, 245, 37, 17, 191, 50, 17, 196, 51, 151,
        63])
    )
    parser.receive_data(bytes([
        66, 82, 78, 67, 2, 11, 121, 0, 0, 2, 0, 8, 1, 26, 117, 18, 115, 10, 113, 8, 214, 8, 18, 108,
        192, 0, 0, 17, 171, 152, 17, 170, 61, 17, 174, 231, 17, 182, 195, 17, 185, 173, 17, 178, 41,
        17, 186, 8, 17, 188, 33, 192, 0, 0, 219, 243, 101, 221, 150, 129, 15, 77, 190, 13, 6, 210, 219,
        227, 131, 217, 96, 162, 13, 19, 229, 13, 90, 185, 192, 0, 0, 12, 255, 201, 12, 228, 181, 17,
        182, 186, 13, 218, 119, 12, 219, 216, 13, 18, 5, 16, 174, 225, 13, 13, 50, 192, 0, 0, 13, 27,
        229, 12, 251, 200, 13, 20, 219, 12, 251, 65, 13, 40, 130, 12, 242, 249, 17, 184, 212, 17, 189,
        214, 174, 78,
    ]))

    # IMU data
    parser.receive_data(bytes([66, 82, 78, 67, 2, 11, 55, 0, 0, 2, 0, 34, 53, 18, 51, 10, 15, 21, 0, 12, 226, 198, 29, 0, 8, 16, 70, 37, 0, 64, 206, 70, 18, 15, 21, 0, 8, 136, 197, 29, 0, 0, 160, 68, 37, 0, 64, 64, 196, 26, 15, 21, 0, 128, 139, 67, 29, 0, 0, 130, 194, 37, 0, 0, 114, 195, 171, 223]))
    parser.receive_data(bytes([66, 82, 78, 67, 2, 11, 55, 0, 0, 2, 0, 34, 53, 18, 51, 10, 15, 21, 0, 12, 236, 198, 29, 0, 8, 40, 70, 37, 0, 64, 188, 70, 18, 15, 21, 0, 8, 136, 197, 29, 0, 0, 128, 68, 37, 0, 64, 64, 196, 26, 15, 21, 0, 128, 141, 67, 29, 0, 0, 104, 194, 37, 0, 0, 112, 195, 145, 106]))
    logger.debug("Finished receiving data")

    async for py_message in message_stream:
        handle_message(py_message, logger, on_eeg_data=on_eeg_data)

    logger.info("Finished processing messages")


asyncio.run(main())

