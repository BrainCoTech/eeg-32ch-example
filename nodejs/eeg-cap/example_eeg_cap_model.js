class EEGData {
  constructor(timestamp, channelValues) {
    this.timestamp = timestamp;
    this.channelValues = channelValues;
  }

  static fromData(arr) {
    return new EEGData(arr[0], arr.slice(1));
  }

  __repr__() {
    return `EEGData(timestamp=${this.timestamp}, channelValues=${this.channelValues})`;
  }
}

class IMUData {
  constructor(timestamp, acc, gyro, mag) {
    this.timestamp = timestamp;
    this.acc = new IMUCord(acc[0], acc[1], acc[2]);
    this.gyro = new IMUCord(gyro[0], gyro[1], gyro[2]);
    this.mag = new IMUCord(mag[0], mag[1], mag[2]);
  }

  static fromData(arr) {
    return new IMUData(arr[0], arr.slice(1, 4), arr.slice(4, 7), arr.slice(7));
  }

  __repr__() {
    // return `imu timestamp=${this.timestamp}`;
    return `IMUData(timestamp=${this.timestamp}, acc=${this.acc}, gyro=${this.gyro}, mag=${this.mag})`;
  }
}

class IMUCord {
  constructor(cord_x, cord_y, cord_z) {
    this.cord_x = cord_x;
    this.cord_y = cord_y;
    this.cord_z = cord_z;
  }

  static fromJson(json_obj) {
    return new IMUCord(json_obj["cordX"], json_obj["cordY"], json_obj["cordZ"]);
  }

  __repr__() {
    return `x=${this.cord_x}, y=${this.cord_y}, z=${this.cord_z}`;
    // return `IMUCord(cordX=${this.cord_x}, cordY=${this.cord_y}, cordZ=${this.cord_z})`;
  }
}

function printTimestamp(list) {
  if (list.length < 6) {
    for (const row of list) {
      console.log("timestamp", row.timestamp);
    }
    return;
  }
  for (const row of list.slice(0, 3)) {
    console.log("timestamp", row.timestamp);
  }
  console.log("...");
  for (const row of list.slice(-3)) {
    console.log("timestamp", row.timestamp);
  }
}

export { EEGData, IMUData, printTimestamp };
