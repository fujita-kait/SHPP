// receiveEL/refrigerator.js
// Refrigerator   2017.02.17
// Process SetI_SNA(0x51), Get_SNA(0x52), Set_Res(0x71), Get_Res(0x72) and INF(0x73)
// set EDT to global data, key = "seoj" + "epc"

let epc = msg.elr.epc;
let eoj = msg.elr.seoj;
let key = String(eoj[0]) + String(eoj[1]) + String(epc);
let esv = msg.elr.esv;
let edt = msg.elr.edt;

if (eoj[0] == 0x03B7) { // Refrigerator
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
        if (edt[0] == 0x41) {
          global.set(key, "open");
        } else if (edt[0] == 0x42) {
          global.set(key, "close");
        }
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

return msg;