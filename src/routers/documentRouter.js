import express from 'express';
import bodyParser from 'body-parser';
import Document from '../models/document/document';
import {getUserId} from '../utils/getUserById';


const router = express.Router();
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());

const checkAuth = async (req, res) => {
    const authorization = req.get('Authorization');
    // console.log('auth', authorization);
    return getUserId(authorization).catch((err) => {
        res.status(401).send({error: 'Not authenticated'});
    });
    // return null;
};


/**
 * Crate new document
 *
 * in body
 * @param {String} name - Name of document
 * @param {String} tree - Serialized json representation of site tree
 * @return {Object} created document
 */
router.post('/', async (req, res) => {

    const userId = await checkAuth(req, res);

    if (!userId) return res;

    const {body: {name, tree}} = req;

    if (!name || !tree) return res.status(406).send({error: 'Invalid content'}); // TODO use middleware to validate params

    Document.create({
            name,
            tree,
            changeDate: Date.now(),
            author: userId,
        },
        (err, {id, name, tree, changeDate}) => {
            if (err) {
                res
                    .status(500)
                    .send({error: 'There was a problem adding the information to the database.'});
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
router.get('/', async (req, res) => {
    const userId = await checkAuth(req, res);
    if (!userId) return res;

    Document.find({author: userId}, (err, documents) => {
        if (err)
            res
                .status(500)
                .send({error: 'There was a problem finding the documents.'});
        else
            res
                .status(200)
                .send(documents.map(document => {
                    const {changeDate} = link ? document.published.slice(-1) : document;
                    const {id, name, link} = document;
                    return {id, name, link, changeDate};
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
router.get('/:id', async (req, res) => {

    const userId = await checkAuth(req, res);
    if (!userId) return res;

    const {params: {id}} = req;

    if (!id) return res.status(406).send({error: 'Invalid content'}); // TODO use middleware to validate params
    Document.findById(id, (err, document) => {
        if (err)
            res
                .status(500)
                .send({error: 'There was a problem finding the information in database.'});
        else if (!document)
            res
                .status(404)
                .send({error: 'No document found.'});
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
 * @return {Object} deleted document
 */
router.delete('/:id', async (req, res) => {
    const userId = await checkAuth(req, res);
    if (!userId) return res;

    const {params: {id}} = req;

    if (!id) return res.status(406).send({error: 'Invalid content'});
    Document.findByIdAndRemove(id, (err, document) => {
        if (err)
            res
                .status(500)
                .send({error: 'There was a problem deleting the document.'});
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
router.put('/:id', async (req, res) => {
    const userId = await checkAuth(req, res);
    if (!userId) return res;

    const {params: {id}, body: {name, tree}} = req;

    if (!id) return res.status(406).send({error: 'Invalid content'}); // TODO use middleware to validate paramsi        console.log(err);

    Document.findById(id, async (err, doc) => {
        if (err)
            res
                .status(500)
                .send({error: 'There was a problem updating the document.'});
        else {
            if(tree) doc.tree = tree;
            if(name) doc.name = name;
            doc.changeDate = Date.now();
            const document = await doc.save()
                .catch(
                    () => res
                        .status(500)
                        .send({error: 'There was a problem updating the document.'}),
                );
            res
                .status(200)
                .send(document);
        }
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
 * @return {Object} new published document
 */
router.post('/published/:id', async (req, res) => {
    const userId = await checkAuth(req, res);
    if (!userId) return res;

    const {params: {id}, body: {name, tree}} = req;

    if (!id || !name || !tree) return res.status(406).send({error: 'Invalid content'}); // TODO use middleware to validate params

    Document.findById(id, (err, document) => {
        if (err)
            res
                .status(500)
                .send({error: 'There was a problem finding the information in database.'});
        else if (!document)
            res
                .status(404)
                .send({error: 'No document found.'});
        else {
            const newDoc = {
                saved: document.saved,
                link: document.link,
                name: document.name,
                tree: document.tree,
                changeDate: document.changeDate,
                published: [...document.published, {name, tree, changeDate: Date.now()}],
            };
            // console.log(newDoc);
            Document.findByIdAndUpdate(id,
                newDoc,
                {new: true},
                (err, document) => {
                    if (err)
                        res
                            .status(500)
                            .send({error: 'There was a problem adding the information to the database.'});
                    else {
                        const {name, tree, changeDate} = document.published.slice(-1)[0];
                        res
                            .status(200)
                            .send({name, tree, changeDate, id: document.id});
                    }

                    return res;
                },
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
router.post('/saved/:id', async (req, res) => {
    const userId = await checkAuth(req, res);
    if (!userId) return res;

    const {params: {id}, body: {name, tree}} = req;

    if (!id || !name || !tree) return res.status(406).send({error: 'Invalid content'}); // TODO use middleware to validate params

    Document.findById(id, (err, document) => {
        if (err)
            res
                .status(500)
                .send({error: 'There was a problem finding the information in database.'});
        else if (!document)
            res
                .status(404)
                .send({error: 'No document found.'});
        else {
            const newDoc = {
                saved: [...document.saved, {name, tree, changeDate: Date.now()}],
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
                            .send({error: 'There was a problem adding the information to the database.'});
                    else {
                        const {name, tree, changeDate} = document.saved.slice(-1)[0];
                        res
                            .status(200)
                            .send({name, tree, changeDate, id: document.id});
                    }

                    return res;
                },
            );

        }
        return res;
    });
});


export default router;