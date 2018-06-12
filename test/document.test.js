/**
 * Created by bogdan on 26.03.18.
 */
import assert from 'assert';
import request from 'request';

import '../src/server'; // start server
import {makeRequest} from './utils/request';

const port = process.env.PORT || 9000;

const getDocument = (id, token) => makeRequest({id, token, port});

const createDocument = (document, token) => makeRequest({json: document, token, method: 'POST', port});

const deleteDocument = (id, token) => makeRequest({method: 'DELETE', id, token, port});

const updateDocument = (id, document, token) => makeRequest({method: 'PUT', id, json: document, token, port});


describe('Test Document API', () => {

    const testUrl1 = '/api/documents';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YjFkYjUyYTA3NmM3YzIzNzQ0ZGMxMGQiLCJpYXQiOjE1Mjg2NzM1Nzh9.o7X7PnNfztgy6hvJEpAZbGlbpWAqwGuQclprQt3DFpg';

    //TODO create test user
    // TODO get his auth token

    it(`POST ${testUrl1}, should return new Document`, async () => {
        const expected = {name: 'Test', tree: JSON.stringify([])};

        const {body: {id, name, tree}} = await createDocument(expected, token);

        assert.deepEqual({name, tree}, expected);

        deleteDocument(id, token);
    });

    it(`GET ${testUrl1}, should return all Documents`, done => {

        const expectedDict = ['id', 'name', 'changeDate'];
        const url = `http://127.0.0.1:${port}${testUrl1}`;

        const options = {
            url,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            json: {},
        };

        request.get(
            options,
            (err, res) => {
                const expected = res.body;
                const actual = expected.filter(doc =>
                    expectedDict.filter(key => doc.hasOwnProperty(key)).length === expectedDict.length,
                );
                assert.equal(actual.length, expected.length);
                done();
            });
    });

    it(`GET ${testUrl1}/:id, should return Document by id`, async () => {
        const expected = {name: 'Test', tree: JSON.stringify([])};

        const {body: {id}} = await createDocument(expected, token);
        const {body: {name, tree}} = await getDocument(id, token);

        assert.deepEqual({name, tree}, expected);

        deleteDocument(id, token);
    });

    it(`DELETE ${testUrl1}/:id, should delete and return Document by id`, async () => {
        const expected = {name: 'Test', tree: JSON.stringify([])};

        const {body: {id}} = await createDocument(expected, token);
        const {body: {name, tree}} = await deleteDocument(id, token);
        const {body} = await getDocument(id, token);

        assert.deepEqual({name, tree}, expected);
        assert.equal(body.hasOwnProperty('error'), true);
    });

    it(`PUT ${testUrl1}/:id, should update and return Document by id`, async () => {
        const init = {name: 'Test1', tree: JSON.stringify([])};
        const expected = {name: 'Test2', tree: JSON.stringify([])};

        const {body: {id}} = await createDocument(init, token);
        const {body: {name, tree}} = await updateDocument(id, expected, token);

        assert.deepEqual({name, tree}, expected);

        deleteDocument(id, token);
    });

    it(`POST ${testUrl1}/published/:id, should publish and return Document by id`, async () => {
        const init = {name: 'Test', tree: JSON.stringify([])};
        const expectd = {name: 'Published', tree: JSON.stringify([])};

        const {body: {id}} = await createDocument(init, token);
        const {body: {name, tree}} = await makeRequest({id: `published/${id}`, json: expectd, token, method: 'POST', port});

        assert.deepEqual({name, tree}, expectd);

        deleteDocument(id, token);
    });

    it(`POST ${testUrl1}/saved/:id, should publish and return Document by id`, async () => {
        const init = {name: 'Test', tree: JSON.stringify([])};
        const expected = {name: 'Saved', tree: JSON.stringify([])};

        const {body: {id}} = await createDocument(init, token);
        const {body: {name, tree}} = await makeRequest({id: `saved/${id}`, json: expected, token, method: 'POST', port});

        assert.deepEqual({name, tree}, expected);

        deleteDocument(id, token);
    });

});