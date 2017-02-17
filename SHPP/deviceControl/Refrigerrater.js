// deviceControl/Refrigerator.js
// 2017.02.17
// Process WebApi about Refrigerator
// Sample:
// /EL/deviceControl?device=Refrigerator_1&func=getOperatingStatus

let device = msg.payload.device;
let func   = msg.payload.func;
let param  = msg.payload.param;

// device check: Refrigerator
if (!device.toLowerCase().includes("Refrigerator".toLowerCase())) {
	return;
}

let epc = 0x80;     // default: OperatingStatus
let esv = 0x62;     // default: Get
let tid = 5;
let seoj = [0x05ff, 1]; // Controller
let edt = [];

// get ip and deoj from deviceList by device name
let deviceList = global.get("deviceList");
let ip = deviceList[device].ip;
let deoj = deviceList[device].eoj;

// process webApi request
switch (func.toLowerCase()) {
	case "getOperatingStatus".toLowerCase():	// EPC=0x80
    	break;
	case "setOperatingStatus".toLowerCase():	// EPC=0x80
        esv = 0x61;     // SetC
		if (param.toLowerCase() == "on") {
		    edt[0] = 0x30;
		} else {
		    edt[0] = 0x31;
		}
    	break;
	case "getDoorStatus".toLowerCase():	// EPC=0xB0
        epc = 0xB0;
    	break;
	default:
		break;
}

msg.els = {
    "ip" : ip,
    "tid" : tid,
    "seoj" : seoj,
    "deoj" : deoj,
    "esv" : esv,
    "epc" : epc,
    "edt" : edt
};

return msg;