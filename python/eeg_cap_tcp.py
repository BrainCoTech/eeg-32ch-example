import asyncio
import logging
import matplotlib.pyplot as plt
import numpy as np
from logger import getLogger
from logger import getLogger
import pyqtgraph as pg
from pyqtgraph.Qt import QtCore, QtGui
import sys

from bc_proto_sdk import MessageParser, MsgType, PyTcpClient  # , DownsamplingOperations
import bc_proto_sdk
from eeg_cap_model import (
    handle_message,
    perform_bandpass,
    remove_env_noise,
    # set_env_noise_filter_cfg,
)

# logger = getLogger(logging.DEBUG)
logger = getLogger(logging.INFO)

# 设定参数
fs = 250  # 采样频率
order = 4  # 滤波器阶数
low_cut = 2  # 低通滤波截止频率
high_cut = 45  # 高通滤波截止频率
edge = 10

plots = []
curves = []
num_channels = 32
data_length = 100  # 每个通道显示的数据点数

# 32通道的EEG数据，二维数组
# eeg_values = [[] for _ in range(32)]

# 生成初始数据
eeg_values = np.zeros((num_channels, data_length))

# 绘图计数器
counter = 0


def on_eeg_data(eeg_data):
    # logger.debug(f"Received EEG data, {type(eeg_data.sample1)}")
    for i in range(32):
        eeg_values[i].append(eeg_data.sample1[i])
        # 每个通道最大保存1000个数据
        if len(eeg_values[i]) > 1000:
            eeg_values[i] = eeg_values[i][-1000:]

    global counter
    counter += 1
    if counter % 250 == 0:
        update()
        # plt.clf()  # 清除当前图像
        # draw_eeg_data()


# 更新函数
def update():
    global eeg_values
    # 更新每条曲线
    for i in range(num_channels):
        curves[i].setData(eeg_values[i])


def draw_eeg_data():
    global eeg_values
    plt.figure(figsize=(20, 15))
    for i in range(32):
        plt.subplot(8, 4, i + 1)  # 创建8行4列的子图
        data = eeg_values[i]
        logger.debug(f"Raw data for channel {i}, {data}")

        # 检查数据长度是否满足要求
        if len(data) > edge:  # 假设 edge 是 remove_env_noise 函数的最小数据长度要求
            data = remove_env_noise(data)  # 去除环境噪声
            data = perform_bandpass(data, order, low_cut, high_cut, fs)  # 带通滤波
            # data = perform_downsampling(data, 50, DownsamplingOperations.Mean)  # 降采样
            logger.debug(f"Drawing Filter data for channel {i}, {data}")
        else:
            logger.warning(
                f"Data length for channel {i} is too short for noise removal"
            )

        plt.plot(data, label=f"EEG Channel {i}")
        plt.legend()
        plt.xlabel("Time [s]")
        plt.ylabel("Amplitude")
        plt.title(f"EEG Channel {i}")
        plt.grid(True)
    plt.tight_layout()  # 调整子图间距
    plt.show()


### main.py
async def main():
    # 创建主窗口
    app = QtGui.QApplication(sys.argv)
    win = pg.GraphicsLayoutWidget(show=True, title="32-Channel Dynamic Plot")
    win.resize(1000, 600)
    win.setWindowTitle("32-Channel Dynamic Plot")

    # 扫描不到service时，可以对照[Discovery APP](https://apps.apple.com/cn/app/discovery-dns-sd-browser/id1381004916)
    (addr, port) = await bc_proto_sdk.eeg_cap.mdns_scan()
    logger.info(addr)

    # 创建消息解析器
    parser = MessageParser("eeg-cap-device", MsgType.EEGCap)
    message_stream = parser.get_message_stream()

    # 创建TCP客户端
    client = PyTcpClient(addr, port)
    # 连接设备
    await client.connect(parser)

    # 读取配置
    # await client.get_eeg_config()
    # await client.get_eeg_config()
    # await client.get_imu_config()
    # await client.get_imu_config()

    # 配置EEG/IMU
    # await client.set_eeg_config(
    #     EegSampleRate.SR_250Hz, EegSignalGain.GAIN_6, EegSignalSource.NORMAL
    # )
    # await client.set_eeg_config(
    #     EegSampleRate.SR_500Hz, EegSignalGain.GAIN_1, EegSignalSource.NORMAL
    # )
    # await client.set_imu_config(ImuSampleRate.SR_50Hz)
    # await client.set_imu_config(ImuSampleRate.SR_100Hz)

    # 开始/停止EEG/IMU数据流
    # await client.stop_eeg_stream()
    # await client.stop_imu_stream()
    await client.start_eeg_stream()
    # await client.start_imu_stream()

    # 设置定时器定期调用更新函数
    timer = QtCore.QTimer()
    timer.timeout.connect(update)
    timer.start(50)  # 每50ms刷新一次

    # 生成32个图表，每个图表表示一个通道
    for i in range(num_channels):
        plot = win.addPlot(title=f"Channel {i + 1}")
        plot.setYRange(-1, 1)  # 设置Y轴范围
        curve = plot.plot(
            pen=pg.mkPen(color=(i * 8 % 255, i * 16 % 255, i * 32 % 255), width=1.5)
        )  # 设置曲线颜色
        plots.append(plot)
        curves.append(curve)
        if (i + 1) % 4 == 0:  # 每4个通道换一行
            win.nextRow()

    logger.debug("Starting Received messages")
    async for py_message in message_stream:
        handle_message(py_message, logger, on_eeg_data=on_eeg_data)

    logger.info("Finished Received messages")

# 运行应用
if __name__ == "__main__":
    QtGui.QApplication().instance().exec_()
    asyncio.run(main())
