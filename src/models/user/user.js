/**
 * Created by bogdan on 05.04.18.
 */
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    login: String,//Number
    password: String,
});

mongoose.model('User', UserSchema);

export default mongoose.model('User');