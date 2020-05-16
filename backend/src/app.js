import express from 'express';
import cors from 'cors';
import routes from './routes';

// import schemaValidator from './app/middlewares/schemavalidator';

import './database';

// const validRequest = schemaValidator(true);

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(cors());
        this.server.use(express.json());
        // this.server.use(validRequest);
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;
