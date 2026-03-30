// preload.js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    closeWindow: () => ipcRenderer.send('closeWindow'),
    moveWindow: (bounds) => ipcRenderer.send('moveWindow', bounds),
    minimizeWindow: () => ipcRenderer.send('minimizeWindow'),
    maximizeWindow: () => ipcRenderer.send('maximizeWindow'),
    newWindow: () => ipcRenderer.send('newWindow'),
    onWindowBlurred: (callback) => ipcRenderer.on('windowBlurred', callback),
    onWindowFocused: (callback) => ipcRenderer.on('windowFocused', callback),
})

// 所有的 Node.js API接口 都可以在 preload 进程中被调用.
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})