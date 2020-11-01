"use strict";

declare const __static: string;

import {
  app,
  protocol,
  BrowserWindow,
  powerMonitor,
  ipcMain,
  Tray,
  Menu,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
import { User } from "./api/types";
import { autoUpdater } from "electron-updater";
import { MenuItemConstructorOptions } from "electron/main";
const isDevelopment = process.env.NODE_ENV !== "production";

// Keep a global reference of the window, idle window and tray object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null = null;
let tray: Tray | null = null;
let idleWin: BrowserWindow | null = null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

interface AppState {
  loggedIn: boolean;
  hasRunningTimeEntry: boolean;
  user: User | null;
}

const appState: AppState = {
  loggedIn: false,
  hasRunningTimeEntry: false,
  user: null,
};

const trayParts: { [key: string]: () => MenuItemConstructorOptions } = {
  loggedInUser: () => ({
    //@ts-ignore
    label: appState.user ? appState.user.email : "",
    type: "normal",
    enabled: false,
  }),
  startNewTimeEntry: () => ({
    // Todo: Translate
    label: "Starte neuen Zeiteintrag",
    accelerator: "CmdOrCtrl+N",
    click: () => {
      if (win !== null) {
        win.webContents.send("tray.newTimeEntry");
      }
    },
    enabled: !appState.hasRunningTimeEntry,
  }),
  stopCurrentTimeEntry: () => ({
    // Todo: Translate
    label: "Stoppe aktiven Zeiteintrag",
    accelerator: "CmdOrCtrl+S",
    click: () => {
      if (win !== null) {
        win.webContents.send("tray.stopActive");
      }
    },
    enabled: appState.hasRunningTimeEntry,
  }),
  logOut: () => ({
    // Todo: Translate
    label: "Abmelden",
    click: () => {
      if (win !== null) {
        win.webContents.send("tray.logOut");
      }
    },
  }),
};

function buildTray(): MenuItemConstructorOptions[] {
  return [
    trayParts.loggedInUser(),
    { type: "separator" },
    trayParts.startNewTimeEntry(),
    trayParts.stopCurrentTimeEntry(),
    { type: "separator" },
    trayParts.logOut(),
  ];
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 500,
    height: 800,
    minWidth: 450,
    minHeight: 500,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,

      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.setMenuBarVisibility(false);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
    autoUpdater.checkForUpdatesAndNotify();
  }

  win.on("closed", () => {
    win = null;
  });
}

function createTray() {
  const image =
    process.platform === "win32"
      ? "tray.ico"
      : process.platform === "darwin"
      ? "trayTemplate.png"
      : "tray.png";

  tray = new Tray(path.join(__static, image));
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
  createTray();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

function handleLoggedIn(user: User) {
  appState.user = user;

  if (tray !== null) {
    const contextMenu = Menu.buildFromTemplate(buildTray());
    tray.setContextMenu(contextMenu);
  }
}

function handleLoggedOut() {
  appState.user = null;
  appState.loggedIn = false;

  if (tray !== null) {
    tray.setContextMenu(null);
  }
}

ipcMain.on("getIdle", (event) => {
  event.reply("getIdleResponse", powerMonitor.getSystemIdleTime());
});

ipcMain.on("loggedIn", (_, user: User) => handleLoggedIn(user));

ipcMain.on("loggedOut", () => handleLoggedOut());

ipcMain.on("activeTimeEntry", () => {
  appState.hasRunningTimeEntry = true;

  if (tray !== null) {
    const contextMenu = Menu.buildFromTemplate(buildTray());
    tray.setContextMenu(contextMenu);
  }
});

ipcMain.on("noActiveTimeEntry", () => {
  appState.hasRunningTimeEntry = false;

  if (tray !== null) {
    const contextMenu = Menu.buildFromTemplate(buildTray());
    tray.setContextMenu(contextMenu);
  }
});

ipcMain.on("idleWindow.removeStopped", (event, idleSince) => {
  if (win !== null) {
    win.webContents.send("idle.stopActive", idleSince);
  }
});

setInterval(() => {
  const idleTime = powerMonitor.getSystemIdleTime();

  if (idleTime > 60 && idleWin === null && appState.hasRunningTimeEntry) {
    idleWin = new BrowserWindow({
      width: 350,
      height: 500,
      webPreferences: {
        nodeIntegration: (process.env
          .ELECTRON_NODE_INTEGRATION as unknown) as boolean,

        preload: path.join(__dirname, "preload.js"),
      },
    });
    idleWin.on("close", () => {
      idleWin = null;
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      idleWin.loadURL(process.env.WEBPACK_DEV_SERVER_URL + "/#/idle");
      if (!process.env.IS_TEST) idleWin.webContents.openDevTools();
    } else {
      idleWin.loadURL("app://./index.html/#/idle");
    }

    idleWin.setAlwaysOnTop(true);
  }
}, 1000);
