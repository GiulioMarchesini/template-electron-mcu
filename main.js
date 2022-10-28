const { app, BrowserWindow, ipcMain } = require('electron');
const path = require("path");
const { SerialPort } = require('serialport')//!serial port ha tutti i moduli, ma a me interessa solo la classe SerialPort

let mainWindow, port;

//serial port usage
function findBoard(ports) {
    const producer = '045B';
    return new Promise((resolve, reject) => {
        ports.forEach(e => {
            if (e.vendorId === producer) resolve(e.path);
        });
        reject(99);
    })
}
async function serialUsages() {
    try {
        console.log('cerco porta')
        const ports = await SerialPort.list();//find all available ports
        const nPort = await findBoard(ports);
        port = new SerialPort({
            path: nPort,
            baudRate: 115200,
        });//MCU port
        port.on('data', (data) => {
            mainWindow.webContents.send('Port', port.path);//send data to render.js
            mainWindow.webContents.send('BackToFront', data);//send data to render.js
        })
    } catch (error) {
        console.log(error);
    }
}//end serial port usage

//recive data from render.js (frontend)
ipcMain.on('FrontToBack', (event, arg) => {
    console.log(arg);
    if (port) port.write(arg, err => {
        if (err) return console.log('Error on write: ', err.message);
        console.log('message written');
    })
})


//config electron
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        }
    });
    mainWindow.loadFile('index.html');
    mainWindow.webContents.openDevTools();// Open the DevTools.
};

app.whenReady().then(() => {
    createWindow();
    serialUsages();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    process.platform !== "darwin" && app.quit()
});