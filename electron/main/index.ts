import { release } from "node:os";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import {
  type MenuItem,
  type MenuItemConstructorOptions,
  app,
  Menu,
  shell,
  ipcMain,
  BrowserWindow,
  screen
} from "electron";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;
// 是否为开发环境
const isDev = process.env["NODE_ENV"] === "development";

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.mjs");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

// 创建菜单
function createMenu(label = "进入全屏幕") {
  const menu = Menu.buildFromTemplate(
    appMenu(label) as (MenuItemConstructorOptions | MenuItem)[]
  );
  Menu.setApplicationMenu(menu);
}

async function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 1024,
    minHeight: 768,
    title: "Main window",
    icon: join(process.env.PUBLIC, "favicon.ico"),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  createMenu();

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  // win.webContents.on('will-navigate', (event, url) => { }) #344

  // 窗口进入全屏状态时触发
  win.on("enter-full-screen", () => {
    createMenu("退出全屏幕");
  });

  // 窗口离开全屏状态时触发
  win.on("leave-full-screen", () => {
    createMenu();
  });
}

app.whenReady().then(createWindow);

ipcMain.on('set-upgrading', (event, isUpgrading: boolean) => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('set-upgrading', isUpgrading);
  }
});

ipcMain.on('play-upgrade-animation', () => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-upgrade-animation');
  }
});

ipcMain.on('play-clap-animation', () => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-clap-animation');
  }
});

ipcMain.on('play-good-animation', () => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-good-animation');
  }
});

ipcMain.on('play-abandon-animation', () => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-abandon-animation');
  }
});

ipcMain.on('play-delete-animation', () => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-delete-animation');
  }
});

ipcMain.on('play-intimate-animation', () => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-intimate-animation');
  }
});

ipcMain.on('play-work-animation', () => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-work-animation');
  }
});

ipcMain.on('play-new-todo-animation', (event, isEnergetic: boolean, isHighMood: boolean, messages: any) => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-new-todo-animation', isEnergetic, isHighMood, messages);
  }
});

ipcMain.on('play-timer-end-animation', (event, isHighMood: boolean) => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-timer-end-animation', isHighMood);
  }
});

ipcMain.on('play-entertain-animation', () => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-entertain-animation');
  }
});

ipcMain.on('play-study-animation', () => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-study-animation');
  }
});

ipcMain.on('play-other-animation', () => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-other-animation');
  }
});

ipcMain.on('play-energetic-animation', () => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-energetic-animation');
  }
});

ipcMain.on('play-tea-animation', () => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-tea-animation');
  }
});

ipcMain.on('play-pointing-animation', () => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-pointing-animation');
  }
});

ipcMain.on('play-complete-todo-on-time-animation', (event, isEnergetic: boolean, isUpgrade: boolean, isMoodIncreased: boolean, messages: any) => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-complete-todo-on-time-animation', isEnergetic, isUpgrade, isMoodIncreased, messages);
  }
});

ipcMain.on('play-complete-todo-overdue-animation', (event, isEnergetic: boolean, isUpgrade: boolean, isMoodDecreased: boolean, messages: any) => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('play-complete-todo-overdue-animation', isEnergetic, isUpgrade, isMoodDecreased, messages);
  }
});

ipcMain.on('set-intimacy-value', (event, value: number) => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('set-intimacy-value', value);
  }
});

ipcMain.on('set-initial-loop-animation', (event, moodValue: number) => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.webContents.send('set-initial-loop-animation', moodValue);
  }
});

ipcMain.handle('close-desktop-pet', () => {
  const windows = BrowserWindow.getAllWindows();
  const desktopPetWindow = windows.find(w => {
    const url = w.webContents.getURL();
    return url && (url.includes('new-windows') || url.includes('#/new-windows'));
  });
  
  if (desktopPetWindow) {
    desktopPetWindow.close();
    return { success: true };
  }
  return { success: false, message: "桌宠窗口未运行" };
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// 菜单栏 https://www.electronjs.org/zh/docs/latest/api/menu-item#%E8%8F%9C%E5%8D%95%E9%A1%B9
const appMenu = (fullscreenLabel: string) => {
  const menuItems = [
    { label: "关于", role: "about" },
    { label: "开发者工具", role: "toggleDevTools" },
    { label: "强制刷新", role: "forcereload" },
    { label: "退出", role: "quit" }
  ];
  // 生产环境删除开发者工具菜单
  if (!isDev) menuItems.splice(1, 1);
  const template = [
    {
      label: app.name,
      submenu: menuItems
    },
    {
      label: "编辑",
      submenu: [
        { label: "撤销", role: "undo" },
        {
          label: "重做",
          role: "redo"
        },
        { type: "separator" },
        { label: "剪切", role: "cut" },
        { label: "复制", role: "copy" },
        { label: "粘贴", role: "paste" },
        { label: "删除", role: "delete" },
        { label: "全选", role: "selectAll" }
      ]
    },
    {
      label: "显示",
      submenu: [
        { label: "加大", role: "zoomin" },
        {
          label: "默认大小",
          role: "resetzoom"
        },
        { label: "缩小", role: "zoomout" },
        { type: "separator" },
        {
          label: fullscreenLabel,
          role: "togglefullscreen"
        }
      ]
    }
  ];
  return template;
};

// 创建弹窗窗口
function createPopUpWindow(message?: string, duration: number = 3000) {
  const windows = BrowserWindow.getAllWindows();
  console.log("所有窗口信息:", windows.map(w => ({
    title: w.getTitle(),
    bounds: w.getBounds(),
    isFocused: w.isFocused(),
    isVisible: w.isVisible()
  })));

  const desktopPetWindow = windows.find(w => {
    const bounds = w.getBounds();
    const title = w.getTitle();
    return title.includes("桌宠窗口") && bounds.width >= 95 && bounds.width <= 110 && bounds.height >= 95 && bounds.height <= 110;
  });

  console.log("找到的桌宠窗口:", desktopPetWindow);

  if (!desktopPetWindow) {
    console.log("桌宠窗口未运行，无法创建弹窗窗口");
    return { success: false, message: "桌宠窗口未运行" };
  }
  
  const childWindow = new BrowserWindow({
    width: 400,
    height: 200,
    minWidth: 400,
    minHeight: 200,
    transparent: true,
    frame: false,
    backgroundColor: '#00ffffff',
    title: "",
    center: true,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: true
    }
  });

  childWindow.setIgnoreMouseEvents(true);

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#/pop-up-window?message=${encodeURIComponent(message || '')}&duration=${duration}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: `pop-up-window?message=${encodeURIComponent(message || '')}&duration=${duration}` });
  }
  
  childWindow.once('ready-to-show', () => {
    let petX, petY;
    
    try {
      const positionFilePath = join(process.env.DIST_ELECTRON, "desktop-pet-position.json");
      const positionData = readFileSync(positionFilePath, "utf-8");
      const position = JSON.parse(positionData);
      petX = position.x;
      petY = position.y;
    } catch (error) {
      console.log("读取桌宠位置失败，使用桌面正中间作为默认位置");
      const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
      petX = Math.floor((screenWidth - 100) / 2);
      petY = Math.floor((screenHeight - 100) / 2);
      const position = { x: petX, y: petY };
      const positionFilePath = join(process.env.DIST_ELECTRON, "desktop-pet-position.json");
      writeFileSync(positionFilePath, JSON.stringify(position), "utf-8");
    }
    
    const popupWidth = 400;
    const popupHeight = 200;
    const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
    
    let popupX = petX - popupWidth / 2;
    let popupY = petY - popupHeight;
    
    if (popupX < 0) {
      popupX = 0;
    } else if (popupX + popupWidth > screenWidth) {
      popupX = screenWidth - popupWidth;
    }
    
    if (popupY < 0) {
      popupY = petY + 100;
    } else if (popupY + popupHeight > screenHeight) {
      popupY = screenHeight - popupHeight;
    }
    
    childWindow.setPosition(popupX, popupY);
    
    childWindow.show();
    childWindow.setAlwaysOnTop(true, 'screen-saver');
    childWindow.moveTop();
    childWindow.focus();
  });
  
  return { success: true };
}

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg, message?: string, duration?: number) => {
  const isTransparent = arg === "new-windows";
  const isPopUpWindow = arg === "pop-up-window";
  const isCompoundTimer = arg.startsWith("compound-timer");
  
  if (isPopUpWindow) {
    return createPopUpWindow(message, duration);
  }
  
  const childWindow = new BrowserWindow({
    width: isTransparent ? 100 : (isCompoundTimer ? 500 : 1024),
    height: isTransparent ? 100 : (isCompoundTimer ? 450 : 768),
    minWidth: isTransparent ? 100 : (isCompoundTimer ? 500 : 1024),
    minHeight: isTransparent ? 100 : (isCompoundTimer ? 450 : 768),
    transparent: isTransparent,
    frame: !isTransparent,
    backgroundColor: isTransparent ? '#00ffffff' : undefined,
    title: isTransparent ? "" : "Main window",
    icon: isTransparent ? undefined : join(process.env.PUBLIC, "favicon.ico"),
    center: true,
    alwaysOnTop: true,
    show: false,
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: true
    }
  });

  if (arg === "new-windows") {
    if (process.env.VITE_DEV_SERVER_URL) {
      childWindow.loadURL(`${url}#/new-windows`);
    } else {
      childWindow.loadFile(indexHtml, { hash: "new-windows" });
    }
  } else {
    if (process.env.VITE_DEV_SERVER_URL) {
      childWindow.loadURL(`${url}#${arg}`);
    } else {
      childWindow.loadFile(indexHtml, { hash: arg });
    }
  }
  
  childWindow.once('ready-to-show', () => {
    if (isTransparent) {
      try {
        const positionFilePath = join(process.env.DIST_ELECTRON, "desktop-pet-position.json");
        const positionData = readFileSync(positionFilePath, "utf-8");
        const position = JSON.parse(positionData);
        childWindow.setPosition(position.x, position.y);
      } catch (error) {
        console.log("读取桌宠位置失败，使用桌面正中间作为默认位置");
        const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
        const x = Math.floor((screenWidth - 100) / 2);
        const y = Math.floor((screenHeight - 100) / 2);
        childWindow.setPosition(x, y);
        const position = { x, y };
        const positionFilePath = join(process.env.DIST_ELECTRON, "desktop-pet-position.json");
        writeFileSync(positionFilePath, JSON.stringify(position), "utf-8");
      }
    }
    
    childWindow.show();
    childWindow.setAlwaysOnTop(true, 'screen-saver');
    childWindow.moveTop();
    childWindow.focus();
    
    if (isTransparent) {
      const savePosition = () => {
        try {
          const bounds = childWindow.getBounds();
          const position = { x: bounds.x, y: bounds.y };
          const positionFilePath = join(process.env.DIST_ELECTRON, "desktop-pet-position.json");
          writeFileSync(positionFilePath, JSON.stringify(position), "utf-8");
        } catch (error) {
          console.error("保存桌宠位置失败:", error);
        }
      };
      
      childWindow.on('moved', savePosition);
      savePosition();
    }
  });
  
  return { success: true };
});
