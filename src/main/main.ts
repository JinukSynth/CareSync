// main.ts
import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isDev = process.env.NODE_ENV === "development";

// 축소하기 전의 창 크기와 위치를 저장할 변수
let savedBounds = {
    width: 0,
    height: 0,
    x: 0,
    y: 0
};

let mainWindow: BrowserWindow | null = null;
let isQuitting = false;

// IPC 핸들러 설정을 별도 함수로 분리
const setupIPCHandlers = () => {
    ipcMain.handle('minimize-window', () => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) {
            savedBounds = win.getBounds();
            win.setBounds({
                width: 280,
                height: 170,
                x: savedBounds.x,
                y: savedBounds.y
            });
        }
    });

    ipcMain.handle('maximize-window', () => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) {
            win.setBounds(savedBounds);
        }
    });

    // 새로운 IPC 핸들러: 항상 최상위 On/Off 토글
    ipcMain.handle("toggle-always-on-top", () => {
        if (!mainWindow) return false;
        const current = mainWindow.isAlwaysOnTop();
        const newVal = !current;
        mainWindow.setAlwaysOnTop(newVal);
        return newVal; // 새 상태를 반환
    });

    // 피드백 제출 후 앱 종료 처리
    ipcMain.on('feedback-submitted', () => {
        isQuitting = true;
        if (mainWindow) {
            mainWindow.destroy();
        }
    });

    // 피드백 없이 바로 종료
    ipcMain.on('quit-without-feedback', () => {
        isQuitting = true;
        if (mainWindow) {
            mainWindow.destroy();
        }
    });
};

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 320,
        minHeight: 170,
        alwaysOnTop: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    mainWindow.setMenu(null);

    // CSP 설정
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        // 기존 responseHeaders 복사
        const responseHeaders = {
        ...details.responseHeaders,
        };
    
        // 새로운 CSP 문자열 생성
        const cspValue = [
        // 1) 기본
        "default-src 'self';",
    
        // 2) connect-src
        //    Firebase + Google + 필요한 도메인 허용
        "connect-src 'self' " +
        "https://*.firebaseio.com " +
        "https://*.firebasedatabase.app " +
        "https://identitytoolkit.googleapis.com " +
        "https://*.googleapis.com " +
        "https://*.gstatic.com " +
        "https://*.google.com " +
        "wss://*.firebaseio.com " +
        "wss://*.firebasedatabase.app;",
    
        // 3) script-src & script-src-elem
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' " +
        "https://*.gstatic.com " +
        "https://*.googleapis.com " +
        "https://*.firebaseapp.com " +
        "https://*.firebaseio.com " +
        "https://*.firebasedatabase.app " +
        "https://*.google.com;",
    
        "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' " +
        "https://*.gstatic.com " +
        "https://*.googleapis.com " +
        "https://*.firebaseapp.com " +
        "https://*.firebaseio.com " +
        "https://*.firebasedatabase.app " +
        "https://*.google.com;",
    
        // 4) style-src
        //    구글 폰트, 인라인 스타일 허용
        "style-src 'self' 'unsafe-inline' " +
        "https://*.googleapis.com " +
        "https://*.gstatic.com;",
    
        // 5) img-src (이미지 허용)
        //    data: -> base64 인라인 이미지 허용
        "img-src 'self' data: " +
        "https://*.google.com " +
        "https://*.gstatic.com " +
        "https://*.googleapis.com " +
        "https://*.googleusercontent.com;", 
    
        // 6) font-src (폰트 허용)
        "font-src 'self' data: " +
        "https://*.gstatic.com " +
        "https://*.googleapis.com;",
    
        // 7) frame-src (iframe 허용)
        "frame-src 'self' " +
        "https://docs.google.com " + // 구글 폼
        "https://*.google.com " +
        "https://*.firebaseapp.com " +
        "https://*.firebaseio.com " +
        "https://*.firebasedatabase.app;",
        ].join(" ");
    
        // CSP 헤더를 덮어씌움
        responseHeaders["Content-Security-Policy"] = [cspValue];
    
        callback({
        responseHeaders,
        });
    });

    if (isDev) {
        mainWindow.loadURL("http://localhost:3005");
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile('dist/renderer/index.html', {
            hash: '/' // React Router의 기본 경로 지정
        });
        console.log('Production mode');
        // mainWindow.webContents.openDevTools();
    }

    // 창이 닫히려고 할 때 이벤트 처리
    mainWindow.on('close', (e) => {
        if (!isQuitting) {
            e.preventDefault(); // 기본 닫기 동작 방지
            
            // 사용자 정의 대화상자 표시
            dialog.showMessageBox(mainWindow!, {
                type: 'question',
                buttons: ['구글폼 작성', '그냥 종료'],
                defaultId: 0,
                title: '설문조사 요청',
                message: '프로그램을 종료하기 전 피드백을 남겨주시겠어요?',
                detail: '귀하의 의견은 서비스 개선에 큰 도움이 됩니다.'
            }).then(result => {
                if (result.response === 0) {
                    // 설문조사 작성 선택 시
                    mainWindow?.webContents.send('open-feedback-form');
                } else {
                    // 그냥 종료 선택 시
                    isQuitting = true;
                    if (mainWindow) {
                        mainWindow.destroy();
                    }
                }
            });
        }
    });
};

app.whenReady().then(() => {
    setupIPCHandlers(); // IPC 핸들러를 한 번만 등록
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});