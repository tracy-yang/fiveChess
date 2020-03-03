const Koa = require('koa');
const app = new Koa()
const Http = require('http');
const Socket = require('socket.io')
const http = Http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write("holloe  world")    
    res.end("fdsa");
}).listen(3001);

let io = Socket(http)

let chessColor;
var chat = io
  .of('/chess')
  .on('connection', function (socket) {
    socket.on('chooseChess', function(msg){
        chessColor = msg.color;
        chat.emit('chessColor',{color:chessColor,id:msg.id});
    });
    socket.on('isSente',function({id,sente}){
        console.log(id,sente,5555)
        chat.emit('isSente',{sente:sente,id:id});
    })
    socket.on('startGame',function({id}){
        chat.emit('startGame');
    })
    socket.on('drawChess',function(params){
        chat.emit('draw',params);
    })
    socket.on('win',function(color){
        chat.emit('win',color)
    })
  })
  




