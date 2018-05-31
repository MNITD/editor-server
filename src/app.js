/**
 * Created by bogdan on 31.03.18.
 */
import path from 'path';
import express from 'express';
import helmet from 'helmet';
import db from './models/db';
import api from './routers';
import cors from 'cors';

db.connect(); // connect to mongo hosting

const app = express();

app.use(cors());

app.use(helmet());
app.use(express.static(path.join(__dirname+'/../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname+'/../public/index.html'));
});
app.use('/api', api);

app.post('/register', (req, res) => {

});

app.post('/login`', (req, res) => {

});

export default app;