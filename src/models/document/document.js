import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
    name: String,//Number
    tree: String,
    changeDate: String
});

mongoose.model('Document', DocumentSchema);

export default mongoose.model('Document');