import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import homeRoutes from './routes/home.js';
import numbersRoutes from './routes/numbers.js';

dotenv.config();

const whiteList = ["http://localhost:3000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }
  
  middlewares() {
    this.app.use(cors(corsOptions));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }
  
  routes() {
    this.app.use('/', homeRoutes);
    this.app.use('/numbers', numbersRoutes);
  }
}

export default new App().app;