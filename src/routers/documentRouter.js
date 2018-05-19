import express from 'express';
import bodyParser from 'body-parser';
import Document from '../models/document/document';


const router = express.Router();
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

/**
 * Crate new document
 *
 * in body
 * @param {String} name - Name of document
 * @param {String} tree - Serialized json representation of site tree
 * @return {Object} created document
 */
router.post('/', ({body: {name, tree}}, res) => {
    if (!name || !tree) return res.status(406).send('Invalid content'); // TODO use middleware to validate params
    Document.create({
            name,
            tree,
            changeDate: Date.now(),
        },
        (err, {id, name, tree, changeDate}) => {
            if (err) {
                res
                    .status(500)
                    .send('There was a problem adding the information to the database.');
            }
            else
                res
                    .status(200)
                    .send({id, name, tree, changeDate});
            return res;
        });
});

/**
 * Get all documents from models
 *
 * @return {Array} list of all pages
 */
router.get('/', (req, res) => {
    Document.find({}, (err, documents) => {
        if (err)
            res
                .status(500)
                .send('There was a problem finding the documents.');
        else
            res
                .status(200)
                .send(documents.map(document => {
                    const {changeDate} = link ? document.published.slice(-1) : document;
                    const {id, name, link} = document;
                    return {id, name, link, changeDate}
                }));
        return res;
    });
});

/**
 * Get document by id
 *
 * in request
 * @param {String} id - id of document
 * @return {Object} finding document
 */
router.get('/:id', ({params: {id}}, res) => {
    if (!id) return res.status(406).send('Invalid content'); // TODO use middleware to validate params
    Document.findById(id, (err, document) => {
        if (err)
            res
                .status(500)
                .send('There was a problem finding the information in database.');
        else if (!document)
            res
                .status(404)
                .send('No document found.');
        else {
            res
                .status(200)
                .send(document);
        }
        return res;
    });
});

/**
 * Deletes document from models
 *
 * in request
 * @param {String} id - id of document to delete
 */
router.delete('/:id', ({params: {id}}, res) => {
    if (!id) return res.status(406).send('Invalid content');
    Document.findByIdAndRemove(id, (err, document) => {
        if (err)
            res
                .status(500)
                .send('There was a problem deleting the user.');
        else
            res
                .status(200)
                .send(document);
        return res;
    });
});

/**
 * Updates document in models
 *
 * in request
 * @param {String} id - id of document to update
 *
 * in body
 * @param {String} name - name of document
 * @param {String} tree - Serialized json representation of site tree
 * @return {Object} new updated document
 */
router.put('/:id', ({params: {id}, body: {name, tree}}, res) => {
    if (!id || !name || !tree) return res.status(406).send('Invalid content'); // TODO use middleware to validate params
    Document.findByIdAndUpdate(id, {
        name,
        tree,
        changeDate: Date.now()
    }, {new: true}, (err, document) => {
        if (err)
            res
                .status(500)
                .send('There was a problem updating the user.');
        else
            res
                .status(200)
                .send(document);
        return res;
    });
});

/**
 * Publish document in models
 *
 * in request
 * @param {String} id - id of document to publish
 *
 * in body
 * @param {String} name - name of document
 * @param {String} tree - Serialized json representation of site tree
 * @return {Object} new updated document
 */
router.post('/published/:id', ({params: {id}, body: {name, tree}}, res) => {
    if (!id || !name || !tree) return res.status(406).send('Invalid content'); // TODO use middleware to validate params

    Document.findById(id, (err, document) => {
        if (err)
            res
                .status(500)
                .send('There was a problem finding the information in database.');
        else if (!document)
            res
                .status(404)
                .send('No document found.');
        else {
            const newDoc = {
                saved: document.saved,
                link: document.link,
                name: document.name,
                tree: document.tree,
                changeDate: document.changeDate,
                published: [...document.published, {name, tree, changeDate: Date.now()}]
            };
            console.log(newDoc);
            Document.findByIdAndUpdate(id,
                newDoc,
                {new: true},
                (err, document) => {
                    if (err)
                        res
                            .status(500)
                            .send('There was a problem adding the information to the database.');
                    else
                        res
                            .status(200)
                            .send(document.published.slice(-1)[0]);
                    return res;
                }
            );
        }
        return res;
    });
});

/**
 * Save document in models
 *
 * in request
 * @param {String} id - id of document to save
 *
 * in body
 * @param {String} name - name of document
 * @param {String} tree - Serialized json representation of site tree
 * @return {Object} new updated document
 */
router.post('/saved/:id', ({params: {id}, body: {name, tree}}, res) => {
    if (!id || !name || !tree) return res.status(406).send('Invalid content'); // TODO use middleware to validate params

    Document.findById(id, (err, document) => {
        if (err)
            res
                .status(500)
                .send('There was a problem finding the information in database.');
        else if (!document)
            res
                .status(404)
                .send('No document found.');
        else {
            const newDoc = {
                saved: [...document.saved,{name, tree, changeDate: Date.now()}],
                link: document.link,
                name: document.name,
                tree: document.tree,
                changeDate: document.changeDate,
                published: document.published,
            };
            Document.findByIdAndUpdate(id,
                newDoc,
                {new: true},
                (err, document) => {
                    if (err)
                        res
                            .status(500)
                            .send('There was a problem adding the information to the database.');
                    else
                        res
                            .status(200)
                            .send(document.saved.slice(-1)[0]);
                    return res;
                }
            );

        }
        return res;
    });
});


export default router;