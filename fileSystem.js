'use strict';

const async = require('async');
const fs = require('fs');
const osenv = require('osenv');
const path = require('path');
//加入shellAPI，为了在nw.js与electron中都能用，加入下边的代码
let shell = require('electron').shell;
/*if (process.version.electron){
    shell = require('electron').shell;
}else{
    shell = window.require('nw.gui').shell;
}*/


function openFile(filePath) {
    shell.openItem(filePath);

}


function getUsersHomeFolder(){
    return osenv.home();
}

function getFilesInFolder(folderPath,cb){
    fs.readdir(folderPath,cb);
}
function inspectAndDescribeFile(filePath,cb){
    let result = {
        file : path.basename(filePath),
        path : filePath, type : ''
    };
    fs.stat(filePath,(err,stat)=>{
        if(err){
            cb(err);
        }
        else{
            if(stat.isFile()){
                result.type= 'file';
            }
            if(stat.isDirectory()) {
                result.type = 'directory';
            }
        cb(err,result);
        }
    });
}

function inspectAndDescribeFiles(folderPath,files,cb) {
    async.map(files,(file,asyncCb)=>{
        let resolvedFilePath = path.resolve(folderPath,file);
        inspectAndDescribeFile(resolvedFilePath,asyncCb);
    },cb);

}

module.exports = {
    getUsersHomeFolder,
    getFilesInFolder,
    inspectAndDescribeFiles,
    openFile
};