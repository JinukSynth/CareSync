// preload.ts
import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("electron", {
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    receive: (channel, callback) => {
        ipcRenderer.on(channel, (_, data) => callback(data));
    },
    minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
    maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
    // 피드백 관련 함수 추가
    openFeedbackForm: (callback) => {
        ipcRenderer.on('open-feedback-form', () => callback());
    },
    feedbackSubmitted: () => {
        ipcRenderer.send('feedback-submitted');
    },
    toggleAlwaysOnTop: () => ipcRenderer.invoke("toggle-always-on-top")
    // quitWithoutFeedback: () => {
    //   ipcRenderer.send('quit-without-feedback');
    // }
});
