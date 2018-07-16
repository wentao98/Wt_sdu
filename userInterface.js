'use strict'

let document;
const fileSystem = require('./fileSystem');
const path = require('path');

function displayFolderPath(folderPath){
    document.getElementById('current-folder')
        .innerHTML = convertFolderPathIntoLinks(folderPath);
    bindCurrentFolderPath();
}

function clearView(){
    const mainArea = document.getElementById('main-area');
    let firstChild = mainArea.firstChild;
    while(firstChild){
        mainArea.removeChild(firstChild);
        firstChild = mainArea.firstChild;
    }
}

function loadDirectory(folderPath){
    return function(window){
        if(!document) {
            document = window.document;
        }
        displayFolderPath(folderPath);
        fileSystem.getFilesInFolder(folderPath,(err,files)=>{
            clearView();
            if(err){
                return alert('Sorry,you could not load your folder');
            }
            fileSystem.inspectAndDescribeFiles(folderPath
                ,files,displayFiles);
        });
    };
}
function displayFile(file){
    const mainArea = document.getElementById('main-area');
    const template = document.querySelector('#item-template');
    let clone = document.importNode(template.content, true);
    clone.querySelector('img').src = `${file.type}.svg`;
    //clone.querySelector('img')
    //    .setAttribute('data-filePath',file.path);
    //如果是文件夹，则监听图标上的双击事件
    if(file.type==='directory'){
        clone.querySelector('img')
            .addEventListener('dblclick',()=>{
            loadDirectory(file.path)();
        },false);//addEventListener里最后一个参数决定该事件的响应顺序；
      //  如果为true事件执行顺序为 addEventListener
        // ---- 标签的onclick事件 ---- document.onclick
       // 如果为false事件的顺序为 标签的onclick事件
        // ---- document.onclick ---- addEventListener
    }
    if(file.type === 'file'){
        clone.querySelector('img')
            .addEventListener('dblclick',()=>{
             fileSystem.openFile(file.path);
            },false);
    }
    clone.querySelector('.filename').innerText = file.file;
    mainArea.appendChild(clone);
}

function displayFiles(err,files){
    if(err){
        return alert('Sorry,you could not display your file');
    }
    files.forEach(displayFile);
}

function bindDocument(window){
    if(!document){
        document = window.document;
    }
}

//监听用户在搜索框中输入的事件
function bindSearchField(cb){
    document.getElementById('search')
        .addEventListener('keyup',cb,false);
}
//将满足搜索条件的筛选出来
/*function filterResults(results){
    //获取搜索结果中的文件路径用于对比
    const validFilePaths = results.map((result)=>{
        return result.ref;
    });
    const items = document.getElementsByClassName('item');
    for(var i = 0;i < items.length;i++){
        let item = items[i];
        let filePath = item.getElementById('img')[0]
            .getAttribute('data-filepath');
        //文件路径是否匹配搜索结果
        if(validFilePaths.indexof(filePath) !== -1){
            //如果匹配将其显示出来
            item.style = null;
        } else{
            //如果不匹配，则将其隐藏
            item.style = 'display:none';
        }
    }
}
//搜索框为空时会用到下面函数
function resetFilter(){
    const items = document.getElementsByClassName('item');
    for(var i = 0; i < items.length; i++){
        items[i].style = null;
    }
}*/

function convertFolderPathIntoLinks(folderPath){
    const folders = folderPath.split(path.sep);
    const contents = [];
    let pathAtFolder = '';
    folders.forEach((folder)=>{
        pathAtFolder += folder + path.sep;
        contents.push(`<span class="path" 
        data-path="${pathAtFolder.slice(0,-1)}">${folder}</span>`);
    });
    return contents.join(path.sep).toString();
}

function bindCurrentFolderPath(){
    const load = (event) =>{
        const folderPath = event.target.getAttribute('data-path');
        loadDirectory(folderPath)();
    };

    const paths = document.getElementsByClassName('path');
    for(var i = 0; i < paths.length; i++){
        paths[i].addEventListener('click',load,false);
    }
}
module.exports = {
    bindDocument,
    displayFiles,
    loadDirectory,
    bindSearchField,
   // filterResults,
   // resetFilter
};