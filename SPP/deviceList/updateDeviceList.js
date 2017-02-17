// deviceList/updateDeviceList
// Update Device List
// EL?func=updateDeviceList
// Send GET D6 to Node Profile

// command check
if (msg.payload.func.toLowerCase() == "updateDeviceList".toLowerCase()) {
  msg.els = {
    "ip" : "224.0.23.0",
    "tid" : 5,
    "seoj" : [0x05ff,1],
    "deoj" : [0x0ef0,1],
    "esv" : 0x62,
    "epc" : 0xD6
  };
} else {
    return;
}
msg.payload = null;
return msg;