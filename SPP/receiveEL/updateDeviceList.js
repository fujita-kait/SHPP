// receiveEL/updateDeviceList.js
// GET_RES or INF D5 or D6              2017.01.05
// 
// D5 or D6 のGET_RES or INFを受信した場合、
// ipとinstance list内のeojのsetをglobal:deviceListで検索し、
// すでに存在するならば破棄、新規ならばdeviceListに追加する。
// その際、keyは機器名+番号。番号は同じ機器でincrementする
// Sample:
// { 
//   "Lighting_1": { 
//     "ip": "192.168.126.124", 
//     "eoj": [ 656, 1 ] 
//   }, 
//   "AirConditioner_1": { 
//     "ip": "192.168.126.101", 
//     "eoj": [ 304, 1 ] 
//   }, 
//   "Lighting_2": { 
//     "ip": "192.168.126.113", 
//     "eoj": [ 656, 1 ] 
//   } 
// }
// NOTE: instance listの最初のEOJのみ処理

const deviceNameTable = global.get("deviceNameTable");

if (((msg.elr.esv == 0x72) || (msg.elr.esv == 0x73)) &&	// GET_RES or INF
    (msg.elr.seoj[0] == 0x0ef0) && 									// Node profile
    ((msg.elr.epc == 0xd5) || (msg.elr.epc == 0xd6))) {		// D5 or D6
	let newDeviceIp = msg.ip;
	let newDeviceEoj0 = msg.elr.edt[1]*256 + msg.elr.edt[2];
	let newDeviceEoj1 = msg.elr.edt[3];
	let deviceList = global.get("deviceList") || {};
	let numberOfTheDevice = 1;							// initialize
	
	for (let deviceName in deviceList) {
	    let ip = deviceList[deviceName].ip;
	    let eoj0 = deviceList[deviceName].eoj[0];
	    let eoj1 = deviceList[deviceName].eoj[1];

		// check if new device is in the deviceList
	    if ((newDeviceIp == ip) && (newDeviceEoj0 == eoj0) && (newDeviceEoj1 == eoj1)) {
	    	console.log("the device has been in the list");
	    	return;	// the device has been in the list
	    } else if (newDeviceEoj0 == eoj0) {
			// count the number of the device
	    	numberOfTheDevice +=1;
	    }
	}
    console.log("newDeviceEoj0",newDeviceEoj0);
    console.log("number2stringHex(newDeviceEoj0)",number2stringHex(newDeviceEoj0));
	let newDeviceName = deviceNameTable[number2stringHex(newDeviceEoj0)] + "_" +  String(numberOfTheDevice);
	console.log("New Device!", newDeviceName);

    let newDevice = {"ip":newDeviceIp, "eoj":[newDeviceEoj0, newDeviceEoj1]};
	deviceList[newDeviceName] = newDevice;
	global.set("deviceList", deviceList);
	return msg;
} else {
    return;
}

// number to String(HEX)
// example number = 304 -> str = 0x0130

function number2stringHex(number) {
    let str = number.toString(16).toUpperCase();
    while (str.length < 4) { str = "0" + str; }
        return "0x" + str;
}