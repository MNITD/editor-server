/**
 * Created by bogdan on 07.04.18.
 */
import express from 'express';
import bodyParser from 'body-parser';

// import userController from '../models/user/user.controller';
import documentRouter from '../routers/documentRouter';


const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use('/documents', documentRouter);

export default router;