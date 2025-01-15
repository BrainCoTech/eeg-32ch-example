# eeg-32ch-example

## Links

[protobuf](https://github.com/BrainCoTech/eeg-32ch-protobuf)

[Python 上位机](https://github.com/BrainCoTech/university-edu-eeg-32ch-tool/)

[语雀文档](https://brainco.yuque.com/hocvv1/mmg6sz/sb5ggb0fv5uihmcu)

[Docs](https://www.brainco-hz.com/docs/eeg-cap/product/eeg-cap.html)

## Python Example

```shell
cd python
pip install -r requirements.txt
# BLE 查询WiFi状态，设置WiFi
python eeg_cap_ble.py 
# QT图表，使用Mock数据
python eeg_cap_mock_qt.py 
# QT图表，使用脑电帽数据
python eeg_cap_qt.py 
# 周期打印收到EEG和IMU数据
python eeg_cap_print_data.py
# EEEG阻抗值检测
python eeg_cap_impendance.py
```

## NodeJS Example

```shell
cd nodejs/eeg-cap
npm install
# node example_eeg_cap_mock.js
node example_eeg_cap_tcp.js
```
