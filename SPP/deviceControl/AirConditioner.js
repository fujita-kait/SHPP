// Home Air Conditioner
// Process WebApi
// Sample:
// /EL/deviceControl?device=AirConditioner_1&func=getOperatingStatus
// /EL/deviceControl?device=AirConditioner_1&func=setOperatingStatus&param=on

let device = msg.payload.device;
let func   = msg.payload.func;
let param  = msg.payload.param;

// device check: AirConditioner
if (!device.toLowerCase().includes("AirConditioner".toLowerCase())) {
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
	case "getAirFlowLevel".toLowerCase():	// EPC=0xA0
        epc = 0xA0;
    	break;
	case "setAirFlowLevel".toLowerCase():	// EPC=0xA0
        epc = 0xA0;
        esv = 0x61;     // SetC
        switch (param.toLowerCase()) {
	        case "auto".toLowerCase():
                edt[0] = 0x41;
    	        break;
	        case "L1".toLowerCase():
                edt[0] = 49;
    	        break;
	        case "L2".toLowerCase():
                edt[0] = 50;
    	        break;
	        case "L3".toLowerCase():
                edt[0] = 51;
    	        break;
	        case "L4".toLowerCase():
                edt[0] = 52;
    	        break;
	        case "L5".toLowerCase():
                edt[0] = 53;
    	        break;
	        case "L6".toLowerCase():
                edt[0] = 54;
    	        break;
	        case "L7".toLowerCase():
                edt[0] = 55;
    	        break;
	        case "L8".toLowerCase():
                edt[0] = 56;
    	        break;
	        default:
		        break;
        }
    	break;
	case "getOperatingMode".toLowerCase():	// EPC=0xB0
        epc = 0xB0;
    	break;
	case "setOperatingMode".toLowerCase():	// EPC=0xB0
        epc = 0xB0;
        esv = 0x61;     // SetC
        switch (param.toLowerCase()) {
	        case "auto".toLowerCase():
                edt[0] = 0x41;
    	        break;
	        case "cooling".toLowerCase():
                edt[0] = 0x42;
    	        break;
	        case "heating".toLowerCase():
                edt[0] = 0x43;
    	        break;
	        case "dehumidification".toLowerCase():
                edt[0] = 0x44;
    	        break;
	        case "ventilation".toLowerCase():
                edt[0] = 0x45;
    	        break;
	        default:
		        break;
        }
    	break;
	case "getTargetTemperature".toLowerCase():	// EPC=0xB3
        epc = 0xB3;
    	break;
	case "setTargetTemperature".toLowerCase():	// EPC=0xB3
        epc = 0xB3;
        esv = 0x61;     // SetC
        edt[0] = parseInt(param, 10);
    	break;
	case "getRoomTemperature".toLowerCase():	// EPC=0xBB
        epc = 0xBB;
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