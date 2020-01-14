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
const connectDB = require('./config/db');
const router = require('./routes');
const passport = require('passport');
const cookieSession = require('cookie-session');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const multer = require('multer');
const http = require('http');

class ApiServer extends http.Server {
  constructor(config) {
    const app = express();
    super(app);
    this.config = config;
    this.app = app;
    this.currentConns = new Set();
    this.busy = new WeakSet();
    this.stopping = false;
  }

  async start() {
    // Connect to database
    connectDB();

    // middleware
    this.app.use(cors());
    this.app.use(bodyParser.json());

    // Dev logging middleware
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    // file uploading
    this.app.use(fileupload());

    // Set static folder
    this.app.use(express.static(path.join(__dirname, 'public')));

    this.app.use(cookieParser());
    this.app.use(
      cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [process.env.cookieKey],
      }),
    );

    // Sanitize data
    this.app.use(mongoSanitize());

    // Set security headers
    this.app.use(helmet());

    // Prevent XSS attacks
    this.app.use(xss());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 10 * 60 * 1000, // 1 mins
      max: 100, // 리퀘스트 요청 빈도
    });

    // this.app.use(limiter);

    // Prevent http param pollution
    this.app.use(hpp());

    // Enable CORS
    this.app.use(cors());

    this.app.use(passport.initialize());
    this.app.use(passport.session());

    // Route files
    this.app.use(router);

    // Router의 catch구문에서 에러를 next()하므로, 이곳으로 넘어온다.
    this.app.use(errorHandler);

    // Dev logging middleware
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    this.app.use((req, res, next) => {
      this.busy.add(req.socket);
      res.on('finish', () => {
        if (this.stopping) req.socket.end();
      });
      next();
    });
    this.app.get('/_health', (req, res) => {
      res.sendStatus(200);
    });
    this.app.use((err, req, res, next) => {
      res.status(500).send(generateApiError('Api::Error'));
    });

    this.on('connection', c => {
      this.currentConns.add(c);
      c.on('close', () => this.currentConns.delete(c));
    });

    this.app.get('/', (req, res) => res.send('Hello World!'));

    this.app.listen(process.env.PORT, () =>
      console.log(`Example app listening on port ${process.env.PORT}!`.yellow.bold),
    );
  }

  shutdown() {
    if (this.stopping) return;
    this.stopping = true;
    this.close(() => {
      process.exit(0);
    });
    setTimeout(() => {
      console.error('비정상적인 종료과정으로서, 강제 종료합니다.');
      process.exit(1);
    }, this.config.shutdownTimeout).unref();
    // fail over 처리
    if (this.currentConns.size > 0) {
      console.log(`현재 동시접속중인 연결(${this.currentConns.size})을 대기중입니다.`);
      for (const con of this.currentConns) {
        if (!this.busy.has(con)) {
          con.end();
        }
      }
    }
  }
}

// Handle unhandled promise rejections 처리되지 않은 약속 거부 처리
process.on('unhandledRejection', (err, promise) => {
  const Server = new ApiServer(config);
  return Server.shutdown();
});

const init = async (config = {}) => {
  const Server = new ApiServer(config);
  return Server.start();
};

init();
