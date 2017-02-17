// receiveEL/generalLighting.js
// General Lighting   2017.01.05
// update: 2017.01.26 16:07
// Process SetI_SNA(0x51), Get_SNA(0x52), Set_Res(0x71), Get_Res(0x72) and INF(0x73)
// set EDT to global data, key = "seoj" + "epc"

let epc = msg.elr.epc;
let eoj = msg.elr.seoj;
let key = String(eoj[0]) + String(eoj[1]) + String(epc);
let esv = msg.elr.esv;
let edt = msg.elr.edt;

if (eoj[0] == 0x0290) { // General Lighting
  if (esv == 0x71) {      // Set_Res
    global.set(key, "ack");
  } else if (esv == 0x72) {   // Get_Res
    switch (epc) {
      case 0x80:
        if (edt[0] == 0x30) {
          global.set(key, "on");
        } else if (edt[0] == 0x31) {
          global.set(key, "off");
        }
        break;
      case 0xB0:
        global.set(key, String(edt[0]) + "%");
        break;
      case 0xB6:
        if (edt[0] == 0x41) {
          global.set(key, "auto");
        } else if (edt[0] == 0x42) {
          global.set(key, "normal");
        } else if (edt[0] == 0x43) {
          global.set(key, "night");
        } else if (edt[0] == 0x45) {
          global.set(key, "color");
        }
        break;
      case 0xC0:
         global.set(key, n2HexString(edt[0]) + n2HexString(edt[1]) + n2HexString(edt[2]));
        break;
      default:
        break;
    }
  } else if (esv == 0x73) {   // INF
    //
  } else if (esv == 0x51) {   // SetC_SNA
    global.set(key, "error: SetC_SNA");
  } else if (esv == 0x52) {   // Get_SNA
    global.set(key, "error: Get_SNA");
  }
}

// from integer to HEX string in even digit
function n2HexString(n){
  let str = n.toString(16);
  if ((str.length % 2) !== 0) {
    str = "0" + str;
  }
  return str;
}

return msg;