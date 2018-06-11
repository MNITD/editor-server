import jwt from 'jsonwebtoken';
import {APP_SECRET} from './app_secret';

const getUserId = authorization => (new Promise((resolve, reject) => {
        const token = authorization.replace('Bearer ', '');
        jwt.verify(token, APP_SECRET, (err, {userId}) => {
            if (err) reject(err);
            resolve(userId);
        });
    })
);

export {getUserId};