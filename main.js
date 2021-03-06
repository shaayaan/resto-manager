const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// Module to use menu
const Menu = electron.Menu

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
// var NodeSession = require('node-session');
// // init
// session = new NodeSession({secret: 'shadab'});
// // start session for an http request - response
// // this will define a session property to the request object
// var req, res, callback;
// session.startSession(req, res, callback);

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})


  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/neworder.html`)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

// Add code function below ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::;

// Populate menu with items
let template = [{
  label: 'Order',
  accelerator: 'F1',
  role: '',
  click: function(){
    mainWindow.loadURL(`file://${__dirname}/neworder.html`)
  }
},{
  label: 'Bills',
  accelerator: 'F2',
  role: '',
  click: function(){
    mainWindow.loadURL(`file://${__dirname}/bill.html`)
  }
},{
  label: 'Menu',
  accelerator: 'F3',
  role: '',
  click: function(){
    mainWindow.loadURL(`file://${__dirname}/menu.html`)
  }
},{
  label: 'Stock',
  accelerator: 'F4',
  role: '',
  click: function(){
    mainWindow.loadURL(`file://${__dirname}/stock.html`)
  }
},{
  label: 'Developer',
   submenu: [{
//     label: 'New Order',
//     accelerator: 'F1',
//     role: 'undo',
// //what happens when you click menu item
//     click: function (item, focusedWindow) {
//       if (focusedWindow) {
//         const options = {
//           type: 'info',
//           title: 'Item clicked',
//           buttons: ['Ok'],
//           message: 'New Order clicked.'
//         }
//         electron.dialog.showMessageBox(focusedWindow, options, function () {})
//       }
//     }
//   },

    label: 'ODT',
    accelerator: 'F11',
    role: 'ODT',
    click: function(){
      mainWindow.webContents.openDevTools()
    }
  }]
  },{
    label:'Help',
    submenu: [{
      type: 'separator'
    },{
      label: 'F1 : New Order'
    },{
      label: 'F2 : Bills'
    },{
      label: 'F3 : Menu'
    },{
      label: 'F4 : Stock'
    }
  ]
  }]

// Some constant menu items like update and version
function addUpdateMenuItems (items, position) {
  if (process.mas) return

  const version = electron.app.getVersion()
  let updateItems = [{
    label: `Version ${version}`,
    enabled: false
  }, {
    label: 'About',
    enabled: true,
    key: 'about'
   }
  //  , {
  //   label: 'Check for Update',
  //   visible: false,
  //   key: 'checkForUpdate',
  //   click: function () {
  //     require('electron').autoUpdater.checkForUpdates()
  //   }
  // }, {
  //   label: 'Restart and Install Update',
  //   enabled: true,
  //   visible: false,
  //   key: 'restartToUpdate',
  //   click: function () {
  //     require('electron').autoUpdater.quitAndInstall()
  //   }
  // }
  ]

  items.splice.apply(items, [position, 0].concat(updateItems))
}


function findReopenMenuItem () {
  const menu = Menu.getApplicationMenu()
  if (!menu) return

  let reopenMenuItem
  menu.items.forEach(function (item) {
    if (item.submenu) {
      item.submenu.items.forEach(function (item) {
        if (item.key === 'reopenMenuItem') {
          reopenMenuItem = item
        }
      })
    }
  })
  return reopenMenuItem
}


if (process.platform === 'win32') {
  const helpMenu = template[template.length - 1].submenu
  addUpdateMenuItems(helpMenu, 0)
}
