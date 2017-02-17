// Parse ECHONET Lite packet
// Assumption: OPC = 1

//  OUTPUT:
//  msg.elr.ip      // ip address (String)
//  msg.elr.ehd     // EHD (Int)
//  msg.elr.tid     // TID (Int)
//  msg.elr.seoj    // SEOJ ([Int:device, Int:instance])
//  msg.elr.deoj    // DEOJ ([Int:device, Int:instance])
//  msg.elr.esv     // ESV (Int)
//  msg.elr.opc     // OPC (Int)
//  msg.elr.epc     // EPC (Int)
//  msg.elr.pdc     // PDC (Int)
//  msg.elr.edt     // EDT ([Int]) or [](no EDT data)

const buffer = msg.payload;

if (buffer.length >= 14) {
  const ehd_buffer = buffer.slice(0, 2);
  const tid_buffer = buffer.slice(2, 4);
  const seoj_device_buffer = buffer.slice(4, 6);
  const seoj_instance_buffer = buffer.slice(6, 7);
  const deoj_device_buffer = buffer.slice(7, 9);
  const deoj_instance_buffer = buffer.slice(9, 10);
  const esv_buffer = buffer.slice(10, 11);
  const opc_buffer = buffer.slice(11, 12);
  const epc_buffer = buffer.slice(12, 13);
  const pdc_buffer = buffer.slice(13, 14);

  const ehd = ehd_buffer.readUInt16BE(0);
  const tid = tid_buffer.readUInt16BE(0);
  const seoj_device = seoj_device_buffer.readUInt16BE(0);
  const seoj_instance = seoj_instance_buffer.readUInt8(0);
  const seoj = [seoj_device, seoj_instance];
  const deoj_device = deoj_device_buffer.readUInt16BE(0);
  const deoj_instance = deoj_instance_buffer.readUInt8(0);
  const deoj = [deoj_device, deoj_instance];
  const esv = esv_buffer.readUInt8(0);
  const opc = opc_buffer.readUInt8(0);
  const epc = epc_buffer.readUInt8(0);
  const pdc = pdc_buffer.readUInt8(0);
  let edt = [];
  
  if (buffer.length >= 15) {
    const edt_buffer = buffer.slice(14);
    for (var i = 0; i < edt_buffer.length; i++) {
        edt[i] = edt_buffer.readUInt8(i);
    }
  }

  // ECHONET Lite header check
  if (ehd == 0x1081) {
    msg.elr = {
        "ip"    : msg.ip,
        "ehd"   : ehd,
        "tid"   : tid,
        "seoj"  : seoj,
        "deoj"  : deoj,
        "esv"   : esv,
        "opc"   : opc,
        "epc"   : epc,
        "pdc"   : pdc,
        "edt"   : edt
    };
  } else {
      return;
  }
} else {
    return;
}

// from integer to HEX string in even digit
function n2HexString(n){
    let str = n.toString(16);
    if ((str.length % 2) === 0) {
        str = "0x" + str;
    } else {
        str = "0x0" + str;
    }
    return str;
}

let edtTmp = [];
for (let edt of msg.elr.edt) {
    edtTmp.push(n2HexString(edt));
}

//  display in HEX format
msg.payload = {
    ip : msg.elr.ip,
    ehd : n2HexString(msg.elr.ehd),
    tid : n2HexString(msg.elr.tid),
    seoj : n2HexString(msg.elr.seoj[0]) + ", " + n2HexString(msg.elr.seoj[1]),
    deoj : n2HexString(msg.elr.deoj[0]) + ", " + n2HexString(msg.elr.deoj[1]),
    esv : n2HexString(msg.elr.esv),
    opc : n2HexString(msg.elr.opc),
    epc : n2HexString(msg.elr.epc),
    pdc : n2HexString(msg.elr.pdc),
    edt : edtTmp
};

return msg;