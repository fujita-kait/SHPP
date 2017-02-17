// test/writeSampleData.js
// 2017.02.17

let deviceList = 
{
	AirConditioner_1:{ip:"192.168.31.2", eoj:[0x0130, 1]},
	AirConditioner_2:{ip:"192.168.31.3", eoj:[0x0130, 1]},
	AirConditioner_3:{ip:"192.168.31.4", eoj:[0x0130, 1]},
	Lighting_1:{ip:"192.168.31.5", eoj:[0x0290, 1]},
	Lighting_2:{ip:"192.168.31.5", eoj:[0x0290, 2]}
};

global.set("deviceList", deviceList);

return msg;