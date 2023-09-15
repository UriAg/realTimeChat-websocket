import __dirname from './utils.js';
import path from 'path';
import express from 'express';
import {engine} from 'express-handlebars';
import { router as homeViewRouter } from './routes/views.router.js';
import { Server } from 'socket.io';

const PORT=8080;

const app=express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'./views'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'./public')));

app.use('/', homeViewRouter);

const server = app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`);
});

const io = new Server(server);

let messages = [];
io.on('connection', socket=>{

    socket.on('isConnected', user=>{
        io.emit('messageLogs', messages);
        socket.broadcast.emit('newUserConection', {user});
    })

    socket.on('message', data=>{
        messages.push(data);
        io.emit('messageLogs', messages);
    })
})