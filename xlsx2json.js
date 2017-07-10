var arguments = process.argv.splice(2);
var srcfile  = arguments[0];
var desfile  = arguments[1];

desfile = desfile == null ? srcfile : arguments[1];

var xlsx = require("node-xlsx");
var fs   = require('fs');
var list = xlsx.parse("./" + srcfile +".xlsx");

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
fs.writeFile("./" + desfile +".json", str, {encoding:'utf-8'}, function(err) {
    if (err) {
        console.log(err)
        return;
    }

    console.log(desfile + ".json 生成成功")
});