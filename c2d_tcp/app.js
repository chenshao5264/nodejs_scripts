let net      = require('net');
let readline = require('readline-sync');

let HOST = 'localhost';
let PORT = 5678;

let client = new net.Socket();
client.setEncoding('utf8')

client.connect(PORT, HOST, function() {
    console.log('connect to: ' + HOST + ':' + PORT + ' \n');
    let input = readline.question('> ');
    client.write(input + '\n');
})

client.on('data', function(data) {
    console.log(data);
    input = readline.question('> ');
    client.write(input + '\n');
});

client.on('close', function() {
    console.log('Connection closed');
});

