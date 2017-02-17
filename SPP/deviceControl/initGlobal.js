// deviceControl/initGlobal.js
// 2017.02.17
// Initialize edt data related to the EL command to be sent

// set tid
let tid = global.get("tid") || 0;
tid = (tid < 65535) ? (tid + 1) : 0;
global.set("tid", tid);
msg.els.tid = tid;

// Initialize global(epc)
let epc = msg.els.epc;  // integer
let eoj = msg.els.deoj;
let key = String(eoj[0]) + String(eoj[1]) + String(epc);
global.set(key, null);  // initialize epc

// initialize time out as 100 x 10ms = 1sec
msg.timeout = 100;

return msg;