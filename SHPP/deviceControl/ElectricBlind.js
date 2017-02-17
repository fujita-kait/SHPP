// Electric Blind
// Process WebApi
// Sample:
// /EL/deviceControl?device=ElectricBlind_1&func=getOperatingStatus
// /EL/deviceControl?device=ElectricBlind_1&func=setOperatingStatus&param=on

let device = msg.payload.device;
let func   = msg.payload.func;
let param  = msg.payload.param;

// device check: Electric Blind
if (!device.toLowerCase().includes("ElectricBlind".toLowerCase())) {
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
	case "getBlindStatus".toLowerCase():	// EPC=0xE0
        epc = 0xE0;
    	break;
	case "setBlindStatus".toLowerCase():	// EPC=0xE0
        epc = 0xE0;
        esv = 0x61;     // SetC
        switch (param.toLowerCase()) {
	        case "open".toLowerCase():
                edt[0] = 0x41;
    	        break;
	        case "close".toLowerCase():
                edt[0] = 0x42;
    	        break;
	        case "stop".toLowerCase():
                edt[0] = 0x43;
    	        break;
	        default:
		        break;
        }
    	break;
	case "getOpenRate".toLowerCase():	// EPC=0xE1
        epc = 0xE1;
    	break;
	case "setOpenRate".toLowerCase():	// EPC=0xE1
        epc = 0xE1;
        esv = 0x61;     // SetC
        edt[0] = parseInt(param, 10);
    	break;
	case "getBlindAngle".toLowerCase():	// EPC=0xE2
        epc = 0xE2;
    	break;
	case "setBlindAngle".toLowerCase():	// EPC=0xE2
        epc = 0xE2;
        esv = 0x61;     // SetC
        edt[0] = parseInt(param, 10);
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