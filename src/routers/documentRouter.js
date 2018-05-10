import express from 'express';
import bodyParser from 'body-parser';
import Document from '../models/document/document';


const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/**
 * Crate new document
 *
 * in body
 * @param {String} name - Name of document
 * @param {String} three - Serialized json representation of site tree
 * @return {Object} created document
 */
router.post('/', ({body:{name, tree}}, res) => {
    if(!name || !tree ) return res.status(406).send('Invalid content'); // TODO use middleware to validate params
    Document.create({
            name,
            tree,
            changeDate : Date.now()
        },
        (err, page) => {
            if (err){
                res
                    .status(500)
                    .send('There was a problem adding the information to the database.');
            }
            else
                res
                    .status(200)
                    .send(page);
            return res;
        });
});

/**
 * Get all pages from models
 *
 * @return {Array} list of all pages
 */
router.get('/',  (req, res) => {
    Document.find({}, (err, pages) => {
        if (err)
            res
                .status(500)
                .send('There was a problem finding the pages.');
        else
            res
                .status(200)
                .send(pages);
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
    if(!id) return res.status(406).send('Invalid content'); // TODO use middleware to validate params
    Document.findById(id, (err, page) => {
        if (err)
            res
                .status(500)
                .send('There was a problem finding the information in database.');
        else if (!page)
            res
                .status(404)
                .send('No document found.');
        else
            res
                .status(200)
                .send(page);
        return res;
    });
});

/**
 * Deletes user from models
 *
 * in request
 * @param {String} id - id of user to delete
 */
// router.delete('/:id', (req, res) => {
//     User.findByIdAndRemove(req.params.id, (err, user) => {
//         if (err)
//             res
//                 .status(500)
//                 .send('There was a problem deleting the user.');
//         else
//             res
//                 .status(200)
//                 .send(user);
//         return res;
//     });
// });

/**
 * Updates user in models
 *
 * in request
 * @param {String} id - id of user to update
 *
 * in body
 * @param {String} name - name of user
 * @param {String} phone - phone number of user
 * @return {Object} new updated user
 */
// router.put('/:id', (req, res) => {
//     User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
//         if (err)
//             res
//                 .status(500)
//                 .send('There was a problem updating the user.');
//         else
//             res
//                 .status(200)
//                 .send(user);
//         return res;
//     });
// });

export default router;