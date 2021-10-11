import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routers/userRouter.js';
import productRouter from './routers/productRouter.js';
import dotenv from 'dotenv';
import path from 'path';
import bmiRouter from './routers/bmiRouter.js';
import orderRouter from './routers/orderRouter.js';
import uploadRouter from './routers/uploadRouter.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.MONGOOSE_URL || 'mongodb://localhost/amazona-ttems', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
/*
this middleware is used to connect tomoongose database
   mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/version1.0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

    'mongodb://localhost/version1.0' default url or use port env like the server port below process.env.MONGODB_URL ||
the mongoosecommunity isinstalledon the computer then connectedtothe server via 'mongodb://localhost/version1.0'
compass is used to show data in database
'mongodb.com/products/compass'(download and install (openmongodb compass app))then go to application and open the compass to see the connected users
*/
app.use('/api/users', userRouter);
app.use('/api/bmi', bmiRouter);
app.use('/api/orders', orderRouter);
app.use('/api/products', productRouter);
app.use('/api/uploads', uploadRouter);

app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.get('/api/config/google', (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || '');
});

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.static(path.join(__dirname, '/1.0/build')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/1.0/build/index.html'))
);

//app.get('/', (req, res) => {
//  res.send('server is runing by hamzy up and runinWIg');
// });
app.use((err, req, res, next) => {
  res.status(501).send({ message: err.message });
});
/* this  middleware is an error catcher app.use((err, req, res, next) => {
res.status(500).send({ message: err.message });
});
cathes all errors
for routers wrapped in expressasynchandler.and will be redirected to the middleware to send message.
*/
const port = process.env.PORT || 5000;

const httpServer = http.Server(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
const users = [];

io.on('connection', (socket) => {
  console.log('connection', socket.id);
  socket.on('disconnect', () => {
    const user = users.find((x) => x.socketId === socket.id);
    if (user) {
      user.online = false;
      console.log('Offline', user.name);
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit('updateUser', user);
      }
    }
  });
  socket.on('onLogin', (user) => {
    const updatedUser = {
      ...user,
      online: true,
      socketId: socket.id,
      messages: [],
    };
    const existUser = users.find((x) => x._id === updatedUser._id);
    if (existUser) {
      existUser.socketId = socket.id;
      existUser.online = true;
    } else {
      users.push(updatedUser);
    }
    console.log('Online', user.name);
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      io.to(admin.socketId).emit('updateUser', updatedUser);
    }
    if (updatedUser.isAdmin) {
      io.to(updatedUser.socketId).emit('listUsers', users);
    }
  });

  socket.on('onUserSelected', (user) => {
    const admin = users.find((x) => x.isAdmin && x.online);
    if (admin) {
      const existUser = users.find((x) => x._id === user._id);
      io.to(admin.socketId).emit('selectUser', existUser);
    }
  });

  socket.on('onMessage', (message) => {
    if (message.isAdmin) {
      const user = users.find((x) => x._id === message._id && x.online);
      if (user) {
        io.to(user.socketId).emit('message', message);
        user.messages.push(message);
      }
    } else {
      const admin = users.find((x) => x.isAdmin && x.online);
      if (admin) {
        io.to(admin.socketId).emit('message', message);
        const user = users.find((x) => x._id === message._id && x.online);
        user.messages.push(message);
      } else {
        io.to(socket.id).emit('message', {
          name: 'Admin',
          body: 'Sorry. I am not online right now',
        });
      }
    }
  });
});

httpServer.listen(port, () => {
  console.log(`server at http://localhost:${port}`);
});