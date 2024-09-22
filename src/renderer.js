const { webUtils,ipcRenderer} = require('electron');
const path = require('path');
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
document.addEventListener('drop', function (e) {
    e.preventDefault();
    e.stopPropagation();
    let filepathlist = [];
    for(let ii = 0;ii < e.dataTransfer.files.length;ii++){
        filepathlist.push(webUtils.getPathForFile(e.dataTransfer.files[ii]));
    }
    //console.log(filepathlist);
    ipcRenderer.send("fileDropped",filepathlist);
});

ipcRenderer.on("loadFiles",(e,files) => {loadFiles(files);});
ipcRenderer.on("clearAllModels",()=>{processCommand("func:clear_all_models;");});

function resourceIsAbsolute(mtlfile){
	let data = fs.readFileSync(mtlfile, 'utf8').toString().split(/[\r\n]+/);
	for(let ii = 0;ii < data.length;ii++){
    let mmat = data[ii].match(/map_[^\s]+[\s]+(.+)$/)
		if(mmat){
			let fname = mmat[1];
			if(path.isAbsolute(fname)){
				return true;
			}else{
				return false;
			}
		}
	}
	return false;
}

var pathIsAbsolute = function (x){
    //console.log(x,path.isAbsolute(x));
    return path.isAbsolute(x);
};
