let args = process.argv.splice(2);
let _walkDir = args[0] || "./";
let _outDir = args[1] || "./" ;


var fs     = require("fs");
var crypto = require('crypto');

function doWalk(path, walkDir) {   
    readFile(path, walkDir);
}

let mapMd5ToFiles = {};

//遍历读取文件
function readFile(path, walkDir) {
    var files = fs.readdirSync(path);//需要用到同步读取
    files.forEach(walk);
    function walk(file){

        var states = fs.statSync(path + '/' + file);   
        if(states.isDirectory()) {
            if (path.indexOf("node_modules") == -1) {
                readFile(path + '/' + file, walkDir);
            }
        }
        else { 
            //创建一个对象保存信息

            var obj = new Object();
            var fullPath = path + '/' + file;
            
            obj.name = fullPath.substring(walkDir.length, fullPath.length);
            //obj.name = obj.path;
            obj.size = states.size;//文件大小，以字节为单位
            var text = fs.readFileSync(fullPath);
            obj.md5 = crypto.createHash('md5').update(text, 'utf-8').digest('hex');


            if (!mapMd5ToFiles[obj.md5]) {
                mapMd5ToFiles[obj.md5] = [];
            }
            mapMd5ToFiles[obj.md5].push({name: obj.name, size: obj.size})
        }  
    }
}

doWalk(_walkDir, _walkDir);



let sameFiles = {};
let idx = 0;

for (let md5 in mapMd5ToFiles) {

    let files = mapMd5ToFiles[md5];
    if (files.length > 1) {
        sameFiles[idx] = files;
        ++idx;
    }
}

function write2File() {
    var content = JSON.stringify(sameFiles);  
    fs.writeFile(_outDir + "/diff.json", content, 'utf-8', function () {
        console.log("生成成功");
    });
}

if (sameFiles[1]) {
    console.log("有相同文件")
    write2File()
} else {
    console.log("恭喜少侠,没有相同文件");
}
