let fs = require("fs");
let compress = require("json-compressor");


function getFileList(path, filesList, walkDir) {
    readFile(path, filesList, walkDir);
    return filesList;
}

let totalSize = 0;
//遍历读取文件
function readFile(path, filesList, walkDir) {
    var files = fs.readdirSync(path);//需要用到同步读取
    files.forEach(walk);
    function walk(file) {

        var states = fs.statSync(path + '/' + file);
        if (states.isDirectory()) {
            readFile(path + '/' + file, filesList, walkDir);
        }
        else {

            var fullPath = path + '/' + file;
            let name = fullPath.substring(walkDir.length + 1, fullPath.length);
            filesList.push(name);

            totalSize += states.size;
        }
    }
}

let filesList = [];
filesList = getFileList("./src", filesList, "./src");
console.log("处理文件数：" + filesList.length)

let fileIndex = 0;
let compressOne = function (fileName) {
    fs.readFile("./src/" + fileName, "utf8", function (err, data) {
        if (err) {
            console.log('读取' + fileName + '失败：' + err);
            return;
        }


        let source = compress(data);
        fs.writeFile("./out/" + fileName, source, { encoding: 'utf-8' }, function (err) {
            if (err) {
                console.log('写入' + fileName + '失败：' + err);
                return;
            }
            ++fileIndex;
            if (fileIndex == filesList.length) {
                console.log('写入完毕');

                calculateFileSizeAfter();
            }
        });
    });
}


for (let i = 0; i < filesList.length; ++i) {
    compressOne(filesList[i])
}

function calculateFileSizeAfter() {
    let beforeSize = totalSize;
    console.log("压缩前文件大小: " + totalSize / 1024 /1024);
    totalSize = 0;
    filesList = [];
    filesList = getFileList("./out", filesList, "./out");
    console.log("压缩后文件大小: " + totalSize / 1024 / 1024);
    console.log("压缩节约空间: " + (beforeSize - totalSize) / beforeSize * 100 + "%");
} 