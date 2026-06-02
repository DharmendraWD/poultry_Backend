const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');



app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://192.168.2.203:3000'
  ],
  credentials: true
}));


// IMPORT ROUTES 
// const userRouter = require('../routes/user.routes');
const homeRouter = require('../routes/home.routes');
const authRouter = require('../routes/auth.routes');
const userRouter = require('../routes/user.routes');
const aboutusRouter = require('../routes/aboutus.routes');
const serviceRouter = require('../routes/service.routes');





// ROUTE DECLARATION
app.get('/', (req, res) => {
  res.send('Server is running... 👀');
});

// app.use('/api/users', userRouter);
app.use('/api/home', homeRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/aboutus', aboutusRouter);
app.use('/api/service', serviceRouter);

module.exports = app;