'use strict'

function displayNote(event, note) {
    //displayNote函数负责将笔记内容插入HTML
    document.getElementById('title').innerText = note.title;
    document.getElementById('contents').innerText = note.contents;

}

//electron的iPCRend尔尔模块监听由后端进程触发的事件
const ipc = require('electron').ipcRenderer;
//菜单项被对单击或者当应用加载的时候，ipcRenderer模块会接收到事件
//以及note对象并将其传递给displayNote函数
ipc.on('displayNote',displayNote);
