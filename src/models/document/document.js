import mongoose from 'mongoose';

const NestedDocumentSchema = new mongoose.Schema({
    name: String,
    tree:String,
    changeDate: String
});
const DocumentSchema = new mongoose.Schema({
    name: String,//Number
    tree: String,
    saved:[NestedDocumentSchema],
    published:[NestedDocumentSchema],
    changeDate: String,
    link: String
});

DocumentSchema.set('toJSON', { virtuals: true });

mongoose.model('Document', DocumentSchema);

export default mongoose.model('Document');