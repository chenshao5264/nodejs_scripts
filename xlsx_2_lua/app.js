
var arguments = process.argv.splice(2);
var srcfile  = arguments[0];
if (srcfile == null) {
    console.log("输入源文件");
    return;
}

var util = require('util');

var path = require('path');

let desfile = path.parse(srcfile).name; 

var xlsx = require("node-xlsx");
var fs   = require('fs');
var sheets = xlsx.parse(srcfile); //读取excel，数组一个sheet一个value

if (sheets == null) {
    console.log("没有合法sheet");
    return;
}

let sheetData = sheets[0].data; // 第一个sheet

var keys     = sheetData[0];
let isContainKeyOfId = false;

for (let i = 0; i < keys.length; ++i) {
    if (keys[i] == 'id') {
        isContainKeyOfId = true;
        break;
    }
}

if (isContainKeyOfId == false) {
    console.log("未包含唯一标志符[id]");
    return;
}

let outs = {}
for (var i = 1; i < sheetData.length; ++i) {
    var line = sheetData[i];

    var obj = {}

    for (var k = 0; k < keys.length; ++k) {
        if (line[k]) {
            obj[keys[k]] = line[k];
        } else {
            obj[keys[k]] = "";
        }
    }
    outs[obj.id] = obj;
}

var str = JSON.stringify(outs);
fs.writeFileSync("./" + desfile +".json", str, {encoding:'utf-8'});
console.log(desfile + ".json 生成成功")

console.log(outs)

let results = "";


function indent_(nest) {
    let spaces = "";
    for (let i = 0; i < nest; ++i) {
        spaces = spaces  + "    ";
    }
    return spaces;
}

function one_table(value, key, nest) {
   // console.log(value)
    // 行首空格
    results = results + indent_(nest);
    results = results + util.format("[\"%s\"] = {\n", key);

    if (typeof(value) === 'object') {
        for (let k in value) {
            results = results + indent_(nest + 1);

            let value_ = value[k];

            if (typeof(value_) === 'string') {
                value_ = value_.replace(/\r\n/g, "\\n");
            }
            
            results = results + util.format("%s = \"%s\",\n", k, value_)
        }
    }

    results = results + "},\n";
}


results = results + 'local configs = {\n';
for (let k in outs) {
    one_table(outs[k], k, 1)   
}
results = results + "}";


fs.writeFileSync("./" + desfile +".lua", results, {encoding:'utf-8'});