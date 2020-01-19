'use strict';

const path = require('path');
const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const errorHandler = require('./middleware/error');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectPg = require('./config/pg');
const connectMongo = require('./config/mongo');
const router = require('./routes');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const fetch = require('node-fetch');

// Load env vars

// Connect to database
connectPg.on('error', () => console.log('Lost PG connection'));
connectMongo();
connectPg.query('CREATE TABLE IF NOT EXISTS values (number INT)').catch(err => console.log(err));

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// file uploading
app.use(fileupload());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.cookieKey]
  })
);

// Sanitize data
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 1 mins
  max: 100 // 리퀘스트 요청 빈도
});

// app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

app.use(passport.initialize());
app.use(passport.session());

// Route files

// redis 기초 예제 (worker와 연동)
app.get('/jsonholder', (req, res) => {
  const redisPublisher = require('./config/redis');
  const redisKey = 'test6';
  return redisPublisher.get(redisKey, (err, response) => {
    if (err) {
      console.error(err);
    }
    if (response) {
      redisPublisher.publish(redisKey, response);
      return res.json({ type: 'cached', data: JSON.parse(response) });
    } else {
      fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then(response => response.json())
        .then(response => {
          redisPublisher.setex(redisKey, 30, JSON.stringify(response));
          return res.json({ type: 'onfly', data: response });
        });
    }
  });
});
app.use(router);

// Router의 catch구문에서 에러를 next()하므로, 이곳으로 넘어온다.
app.use(errorHandler);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const server = app.listen(process.env.PORT, () =>
  console.log(`${process.env.PORT}번으로 Node API 가동 중입니다. `.yellow.bold)
);

// Handle unhandled promise rejections 처리되지 않은 약속 거부 처리
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
