//recive data from backend
window.myAPI.portUsed((event, arg) => {
    document.getElementById('port').innerHTML = "porta usata: " + arg;
})

window.myAPI.getVal((event, arg) => {
    //arg is uint8array, convert to string
    const val = new TextDecoder().decode(arg);
    document.getElementById('answer').innerHTML = val;
})

function turnOnLed() {
    window.myAPI.sendVal('led-on');//send data to backend
}

function turnOffLed() {
    window.myAPI.sendVal('led-off');//send data to backend
}