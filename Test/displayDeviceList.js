// test/displayDeviceList.js
// 2017.02.17
// Test: deviceListの列挙
let deviceList = global.get("deviceList");

for (let deviceName in deviceList) {
    console.log(deviceName);
    console.log(deviceList[deviceName]);
    console.log(deviceList[deviceName].ip);
    console.log(deviceList[deviceName].eoj);
}

msg.payload =  deviceList;
return msg;