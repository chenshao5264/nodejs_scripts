let net      = require('net');
let readline = require('readline-sync');
let fs       = require('fs');  
let util     = require('util');

var pts = [];

async function loadPoints () {

    return new Promise(function (resolve, reject) {

        var lineReader = require('readline').createInterface({
            input: fs.createReadStream('./point.pt')
        });

        lineReader.on('line', function (line) {  //按行对读取流内容进行操作
            pts.push(line)

            resolve(true);
        });
    });
}

async function connectCocos() {
    await loadPoints();
    console.log('文件载入完毕')
    console.log(pts)

    let HOST = 'localhost';
    let PORT = 5678;

    let client = new net.Socket();
    client.setEncoding('utf8')


    client.connect(PORT, HOST, function() {
        console.log('connect to: ' + HOST + ':' + PORT + ' \n');
        //let input = readline.question('> ');
        //client.write(input + '\n');
        
        
        let a = pts.shift();
        if (a) {
            a = JSON.parse(a);
            let cmd = util.format("touch tap %d %d\n", a.x, a.y);
            client.write(cmd);
        }
    })

    client.on('data', function(data) {
        
        //input = readline.question('> ');
        //client.write(input + '\n');

        let a = pts.shift();
        if (a) {
            a = JSON.parse(a);
            let cmd = util.format("touch tap %d %d\n", a.x, a.y);
            client.write(cmd);
        }
    });

    client.on('close', function() {
        console.log('Connection closed');
    });
}

connectCocos()


