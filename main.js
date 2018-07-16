'use strict';

const electron = require('electron');
const app = electron.app;
const Menu = electron.Menu;
const Tray = electron.Tray;
const BrowserWindow = electron.BrowserWindow;

let appIcon = null;
let mainWindow = null;

const notes = [
{
    title: 'todo list',
        contents : 'grocery\npick up\nsend'
},
{
    title: ' wodo',
        contents:'milk\neggs\nbutter'
}
]


function displayNote(note){
    //使用electron的webContents API向浏览器窗口发送数据来展示笔记内容
    mainWindow.webContents.send('displayNote',note);
}

function addNoteToMenu(note){
    return{
        label : note.title,
        type : 'normal',
        click : ()=>{ displayNote(note);}
    };
}

app.on('ready',()=>{
    appIcon = new Tray('icon@2x.png');
    let contextMenu = Menu.buildFromTemplate(notes.map(addNoteToMenu));
    //为托盘应用添加提示信息
    appIcon.setToolTip('Notes app');
    //将上下文菜单绑定到托盘应用上
    appIcon.setContextMenu(contextMenu);

    mainWindow = new BrowserWindow({width: 800, Height: 600});
    mainWindow.loadURL(`file://${app.getAppPath()}/index.html`);
    mainWindow.webContents.on('dom-ready',()=>{
        //当应用视窗加载好后，默认显示第一个笔记内容
        displayNote(notes[0]);
    });
});