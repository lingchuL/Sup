// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, nativeImage, Tray, Menu } = require('electron')
const path = require('node:path')
const http = require("node:http");

const createWindow = (url) => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 800,
        frame: false,
        // transparent: true,
        backgroundColor: '#00000000',
        titleBarStyle: "hidden",
        titleBarOverlay: false,
        webPreferences: {
            // nodeIntegration: true,
            // contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false  // 允许加载本地资源
        }
    })

    // 加载 index.html
    // mainWindow.loadFile('index.html')
    if (url) mainWindow.loadURL(`http://localhost:3000/${url}`)
    else mainWindow.loadURL('http://localhost:3000/login')

    // // 设置CSP策略
    // mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    //     callback({
    //         responseHeaders: {
    //             ...details.responseHeaders,
    //             'Content-Security-Policy': ["default-src 'self' file:"]
    //         }
    //     })
    // });

    // mainWindow.setAlwaysOnTop(false)

    // 打开开发工具
    // mainWindow.webContents.openDevTools()

    // 窗口聚焦状态
    mainWindow.on('blur', ()=>{
        mainWindow.webContents.send('windowBlurred', true)
    })
    mainWindow.on('focus', ()=>{
        mainWindow.webContents.send('windowFocused', true)
    })
}

function onCloseWindow(event) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.close()
    if (tray) tray.destroy()
    const options = {
        hostname: '127.0.0.1',
        port: 8132,
        path: '/sup?action=shut_down',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('响应数据:', data);
        });
    });

    req.on('error', (error) => {
        console.error('请求出错:', error);
    });

    req.end();
}

function onMoveWindow(event, bounds) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    if(win) win.setBounds({x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height})
}

function onMaximizeWindow(event) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    if (win) {
        if (win.isMaximized()) win.restore()
        else win.maximize()
    }
}

function onMinimizeWindow(event) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    if (win) {win.minimize()}
}

function onNewWindow(event, url) {
    createWindow(url)
}

let tray

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    ipcMain.on('closeWindow', onCloseWindow)
    ipcMain.on('moveWindow', onMoveWindow)
    ipcMain.on('maximizeWindow', onMaximizeWindow)
    ipcMain.on('minimizeWindow', onMinimizeWindow)
    ipcMain.on('newWindow', onNewWindow)

    // 托盘显示
    const icon = nativeImage.createFromPath(path.join(__dirname, 'icon.png'))
    tray = new Tray(icon)
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Item1', type: 'radio' },
        { label: 'Item2', type: 'radio' },
        { label: 'Item3', type: 'radio', checked: true },
        { label: 'Item4', type: 'radio' }
    ])
    tray.setContextMenu(contextMenu)
    tray.setToolTip('SupCopilot')
    tray.setTitle('SupCopilot')

    createWindow()

    app.on('activate', () => {
        // 在 macOS 系统内, 如果没有已开启的应用窗口
        // 点击托盘图标时通常会重新创建一个新窗口
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态, 
// 直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。