var arguments = process.argv.splice(2);
var filename  = arguments[0];

var xlsx = require("node-xlsx");
var fs   = require('fs');
var list = xlsx.parse("./" + filename +".xlsx");

var xlsxDatas = list[0].data

var titles = xlsxDatas[0];

var arr = []
for (var k = 1; k < xlsxDatas.length; k++) {
    var xlsxData = xlsxDatas[k]
    var obj = {}

    for (var i = 0; i < titles.length; i++) {
        obj[titles[i]] = xlsxData[i];
    }
    arr.push(obj);
}

var str = JSON.stringify(arr);
fs.writeFile("./" + filename +".json", str, {encoding:'utf-8'}, function(err) {
    if (err) {
        console.log(err)
        return;
    }

    console.log(filename + ".json 生成成功")
});