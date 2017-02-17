// Send ECHONET Lite packet
// Assumption: OPC = 1
//
//  Usage: set following data
//  msg.els.ip      ip address (String)
//  msg.els.tid     TID (Int)
//  msg.els.seoj    SEOJ ([Int:device, Int:instance])
//  msg.els.deoj    DEOJ ([Int:device, Int:instance])
//  msg.els.esv     ESV (Int)
//  msg.els.epc     EPC (Int)
//  msg.els.edt     EDT ([Int]) or []

if (msg.els === null) {
    console.log("msg.els === null");
    return;
}

const tid_buffer = Buffer.allocUnsafe(2);
let   seoj_buffer = Buffer.allocUnsafe(3);
const seoj = msg.els.seoj;
let   deoj_buffer = Buffer.allocUnsafe(3);
const deoj = msg.els.deoj;
const esv_buffer = Buffer.allocUnsafe(1);
const opc_buffer = Buffer.from([1]);
const epc_buffer = Buffer.allocUnsafe(1);
const pdc_buffer = Buffer.allocUnsafe(1);
let edt = msg.els.edt;

tid_buffer.writeUInt16BE(msg.els.tid, 0);
esv_buffer.writeUInt8(msg.els.esv, 0);
epc_buffer.writeUInt8(msg.els.epc, 0);

seoj_buffer.writeUInt16BE(seoj[0], 0);
seoj_buffer.writeUInt8(seoj[1], 2);
deoj_buffer.writeUInt16BE(deoj[0], 0);
deoj_buffer.writeUInt8(deoj[1], 2);

// edt[]からedt_bufferを作成
if ((typeof edt) == "undefined") {
    edt = [];
}

const edt_buffer = Buffer.allocUnsafe(edt.length);
for (var i = 0; i < edt.length; i++) {
    edt_buffer.writeUInt8(edt[i], i);
}

pdc_buffer.writeUInt8(edt_buffer.length, 0);

// Create ECHONET Lite packet
const el_buffer = Buffer.from([
	0x10, 0x81,
	tid_buffer[0], tid_buffer[1],
	seoj_buffer[0], seoj_buffer[1], seoj_buffer[2],
	deoj_buffer[0], deoj_buffer[1], deoj_buffer[2],
	esv_buffer[0], opc_buffer[0], epc_buffer[0], pdc_buffer[0]]);

// add EDT data
if (edt_buffer.length !== 0) {
    msg.payload = Buffer.concat([el_buffer, edt_buffer], 
        (el_buffer.length + edt_buffer.length));
} else {
    msg.payload = el_buffer;
}

msg.ip = msg.els.ip;
return msg;