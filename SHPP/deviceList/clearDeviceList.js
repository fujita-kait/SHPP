// deviceList/clearDeviceList
// Clear Device List
// /EL/deviceList?func=clearDeviceList

if (msg.payload.func.toLowerCase() == "clearDeviceList".toLowerCase()) {
    let deviceList = {};
    global.set("deviceList", deviceList);
} else {
    return;
}
msg.payload = null;
return msg;