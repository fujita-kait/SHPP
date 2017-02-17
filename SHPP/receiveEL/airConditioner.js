// receiveEL/airConditioner.js
// AirConditioner
// Process SetI_SNA(0x51), Get_SNA(0x52), Set_Res(0x71), Get_Res(0x72) and INF(0x73)
// set EDT to global data, key = "seoj" + "epc"     2017.01.05
let epc = msg.elr.epc;
let eoj = msg.elr.seoj;
let key = String(eoj[0]) + String(eoj[1]) + String(epc);
let esv = msg.elr.esv;
let edt = msg.elr.edt;

if (eoj[0] == 0x0130) { // Home Air Conditioner
    if (esv == 0x71) {          // Set_Res
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
            case 0xA0:
                if (edt[0] == 0x41) {
                    global.set(key, "auto");
                } else if (edt[0] == 49) {
                    global.set(key, "L1");
                } else if (edt[0] == 50) {
                    global.set(key, "L2");
                } else if (edt[0] == 51) {
                    global.set(key, "L3");
                } else if (edt[0] == 52) {
                    global.set(key, "L4");
                } else if (edt[0] == 53) {
                    global.set(key, "L5");
                } else if (edt[0] == 54) {
                    global.set(key, "L6");
                } else if (edt[0] == 55) {
                    global.set(key, "L7");
                } else if (edt[0] == 56) {
                    global.set(key, "L8");
                }
                break;
            case 0xB0:
                if (edt[0] == 0x40) {
                    global.set(key, "other");
                } else if (edt[0] == 0x41) {
                    global.set(key, "auto");
                } else if (edt[0] == 0x42) {
                    global.set(key, "cooling");
                } else if (edt[0] == 0x43) {
                    global.set(key, "heating");
                } else if (edt[0] == 0x44) {
                    global.set(key, "dehumidification");
                } else if (edt[0] == 0x45) {
                    global.set(key, "ventilation");
                }
                break;
            case 0xB3:
                global.set(key, String(edt[0]) + "℃");
                break;
            case 0xBB:
                global.set(key, String(edt[0]) + "℃");
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