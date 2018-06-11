/**
 * Created by bogdan on 07.04.18.
 */
import express from 'express';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {APP_SECRET} from '../utils/app_secret';
import documentRouter from '../routers/documentRouter';
import userRouter from '../routers/userRouter';
import User from '../models/user/user';

const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use('/documents', documentRouter);
router.use('/user', userRouter);


router.post('/register', ({body: {login, password}}, res) => {
    if (!login || !password) return res.status(406).send({error: 'Invalid content'}); // TODO use middleware to validate params

    User.find({login}, async (err, [user]) => {
        if (err) {
            res
                .status(500)
                .send({error: 'There was a problem finding the information in the database.'});
        }
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);

            User.create({
                    login,
                    password: hashedPassword,
                },
                (err, {id, login}) => {
                    if (err) {
                        res
                            .status(500)
                            .send({error: 'There was a problem adding the information to the database.'});
                    }
                    else {
                        const token = jwt.sign({userId: id}, APP_SECRET);
                        res
                            .status(200)
                            .send({id, login, token});
                    }
                });
        } else
            res
                .status(406)
                .send({error: 'User with such login already exist.'});

        return res;
    });


});

router.post('/login', ({body: {login, password}}, res) => {
    if (!login || !password) return res.status(406).send({error: 'Invalid content'}); // TODO use middleware to validate params

    User.find({login}, async (err, [user]) => {
        if (err)
            res
                .status(500)
                .send({error: 'Login or password is incorrect.'});
        else {
            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                res
                    .status(500)
                    .send({error: 'Login or password is incorrect.'});
            }
            const token = jwt.sign({userId: user.id}, APP_SECRET);

            res
                .status(200)
                .send({id: user.id, login, token});


        }
        return res;
    });

});


export default router;