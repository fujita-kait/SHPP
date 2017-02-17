// test/getD6.js
// 2017.02.17

let epc = 0xD6; // operatingStatus
let esv = 0x62; // Get
let ip = "224.0.23.0";
let tid = 5;
let seoj = [0x05ff, 1];
let deoj = [0x0ef0, 1];
let edt = [];

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