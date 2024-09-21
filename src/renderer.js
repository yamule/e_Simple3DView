const { webUtils,ipcRenderer  } = require('electron');
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
document.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
//console.log('file dropped:', e.dataTransfer.files[0]);
    let filepathlist = [];
    for(let ii = 0;ii < e.dataTransfer.files.length;ii++){
        filepathlist.push(webUtils.getPathForFile(e.dataTransfer.files[ii]));
    }
    console.log(filepathlist);
    ipcRenderer.send("load_file",filepathlist);
});
