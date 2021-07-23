'use strict';

import { app, protocol, BrowserWindow, ipcMain, shell } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import fs from 'fs';
import os from 'os';
import path from 'path';
// import Datastore from 'nedb';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
const Datastore = require('nedb');
const familyFile = path.join(app.getPath('userData'), './family.nedb');
const spendingFile = path.join(app.getPath('userData'), './spending.nedb');
const incomeFile = path.join(app.getPath('userData'), './income.nedb');
const familyDB = new Datastore({ filename: familyFile, autoload: true });
const spendingDB = new Datastore({ filename: spendingFile, autoload: true });
const incomeDB = new Datastore({ filename: incomeFile, autoload: true });

ipcMain.on('print-to-pdf', (event, arg) => {
  // 作成するPDFの保存パスを指定
  const pdfPath = path.join(os.tmpdir(), arg + '.pdf');
  const win = BrowserWindow.fromWebContents(event.sender);
  // Electronデフォルトで使用できるprintToPDFを使用する
  win.webContents
    .printToPDF({})
    .then(data => {
      fs.writeFile(pdfPath, data, err => {
        if (err) return console.log(err.message);
        shell.openExternal('file://' + pdfPath);
        event.sender.send('wrote-pdf', pdfPath);
      });
    })
    .catch(error => {
      console.log(error);
    });
});

ipcMain.on('getPage', event => {
  familyDB.find({}, (error, docs) => {
    event.sender.send('getPage', docs);
  });
});
ipcMain.on('getSpending', event => {
  spendingDB.find({}, (error, docs) => {
    event.sender.send('getSpending', docs);
  });
});
ipcMain.on('getIncome', event => {
  incomeDB.find({}, (error, docs) => {
    event.sender.send('getIncome', docs);
  });
});

ipcMain.handle('createFamily', async (event, arg) => {
  await familyDB.insert(arg, (error, newFamily) => {
    const date = new Date();
    const data = { family_id: newFamily._id, year: date.getFullYear(), income: 0, rate: 0 };
    incomeDB.insert(data);
  });
  return;
});

ipcMain.handle('createSpending', async (event, arg) => {
  await spendingDB.insert(arg);
  return;
});

ipcMain.handle('createIncome', async (event, arg) => {
  await incomeDB.insert(arg);
  return;
});

ipcMain.handle('editFamily', async (event, arg) => {
  const update = {
    $set: {
      name: arg.name,
      birthday: arg.birthday,
    },
  };
  await familyDB.update({ _id: arg.id }, update, () => {
    return;
  });
  return;
});

ipcMain.handle('editSpending', async (event, arg) => {
  const update = {
    $set: {
      name: arg.name,
      year: arg.year,
      price: arg.price,
    },
  };
  await spendingDB.update({ _id: arg.id }, update, () => {
    return;
  });
  return;
});

ipcMain.handle('editIncome', async (event, arg) => {
  const update = {
    $set: {
      year: arg.year,
      income: arg.income,
      rate: arg.rate,
    },
  };
  await incomeDB.update({ _id: arg.id }, update, () => {
    return;
  });
  return;
});

ipcMain.handle('deleteFamily', async (event, arg) => {
  await familyDB.remove({ _id: arg }, {}, () => {
    incomeDB.remove({ family_id: arg }, {}, () => {
      return;
    });
    return;
  });
  return;
});

ipcMain.handle('deleteSpending', async (event, arg) => {
  console.log(arg);
  await spendingDB.remove({ _id: arg }, {}, () => {
    return;
  });
  return;
});
