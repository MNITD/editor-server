/**
 * Created by bogdan on 05.04.18.
 */
import mongoose from 'mongoose';
import {dbuser, dbpassword} from './db.config';

export default {
    connect() {
        mongoose.connect(`mongodb://${dbuser}:${dbpassword}@ds147469.mlab.com:47469/editor-react-db`);
        return mongoose.connection;
    }
}
