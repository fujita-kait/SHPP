// WebApi for General Lighting
// update: 2017.01.26 15:27
// Sample:
// /EL/deviceControl?device=Lighting_1&func=getOperatingStatus
// /EL/deviceControl?device=Lighting_1&func=setOperatingStatus&param=on

let device = msg.payload.device;
let func   = msg.payload.func;
let param  = msg.payload.param;

// device check: Lighting
if (!device.toLowerCase().includes("Lighting".toLowerCase())) {
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
console.log("func", func);
switch (func.toLowerCase()) {
  case "getOperatingStatus".toLowerCase():  // EPC=0x80
        break;
  case "setOperatingStatus".toLowerCase():  // EPC=0x80
        esv = 0x61;     // SetC
    if (param.toLowerCase() == "on") {
        edt[0] = 0x30;
    } else {
        edt[0] = 0x31;
    }
        break;
  case "getBrightness".toLowerCase():  // 0xB0
    epc = 0xB0;
    break;
  case "setBrightness".toLowerCase():  // 0xB0
    esv = 0x61;     // SetC
    epc = 0xB0;
    edt[0] = parseInt(param, 10);
    break;
  case "getLightingMode".toLowerCase():  // 0xB6
    epc = 0xB6;
    break;
  case "setLightingMode".toLowerCase():    // 0xB6
    esv = 0x61;     // SetC
    epc = 0xB6;
    switch (param.toLowerCase()) {
      case "auto".toLowerCase():
        edt[0] = 0x41;
        break;
      case "normal".toLowerCase():
        edt[0] = 0x42;
        break;
      case "night".toLowerCase():
        edt[0] = 0x43;
        break;
      case "color".toLowerCase():
        edt[0] = 0x45;
        break;
      default:
        break;
        }
    break;
  case "getColorSetting".toLowerCase():    // 0xC0
    epc = 0xC0;
    break;
  case "setColorSetting".toLowerCase():    // 0xC0
    console.log("setColorSetting", param);
    esv = 0x61;     // SetC
    epc = 0xC0;
    let colorNameTable = global.get("colorNameTable");
    let dataTmp = colorNameTable[param];
    if (dataTmp === null) {
      dataTmp = param;
    }
    edt[0] = parseInt(dataTmp.substr(0, 2), 16);
    edt[1] = parseInt(dataTmp.substr(2, 2), 16);
    edt[2] = parseInt(dataTmp.substr(4, 2), 16);
    console.log("dataTmp", dataTmp);
    console.log(edt[0], edt[1], edt[2]);
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