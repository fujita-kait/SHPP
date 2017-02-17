// Get global data to reply http request         2017.01.05
// update: 2017.01.27
// output1: to next node
// output2: repeat

let epc = msg.els.epc;
let eoj = msg.els.deoj;
let key = String(eoj[0]) + String(eoj[1]) + String(epc);
let timeout = msg.timeout;

// get the response of GET or SETC from global data
let data = global.get(key);
msg.payload = data;
if (data === null) {
    if (timeout === 0) { // Timeout: go to next node wo data
        msg.statusCode = 400;   // Client Error: Bad Request
        return [msg, null];
    }
    msg.timeout = timeout -1;
    return [null, msg]; // repeat
}
return [msg, null]; // next flow with data