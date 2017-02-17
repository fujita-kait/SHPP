// deviceList/getDeviceNames
// Get Device Names
// update 2017.01.31
// /EL/deviceList?func=getDeviceNames
// globalのdeviceListからdevice nameを抜き出して戻す
// formatはdevice nameを","で接続したstring
// sample:
// Lighting_1,AirConditioner_1,Lighting_2

if (msg.payload.func.toLowerCase() == "getDeviceNames".toLowerCase()) {
    let deviceList = global.get("deviceList");
    let deviceNames = Object.keys(deviceList);  // deviceNames is array of string
    msg.payload = deviceNames.join();   // 配列の全ての要素を１個の文字列にする
} else {
    return;
}

return msg;