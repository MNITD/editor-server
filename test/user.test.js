import assert from 'assert';

import '../src/server'; // start server
import {makeRequest} from './utils/request';

const port = process.env.PORT || 9000;

const deleteUser = (id, token) => makeRequest({method: 'DELETE', route:'/user', id, token, port});
const registerUser = (user) => makeRequest({method: 'POST', route:'/register', json: user, port});

describe('Test User API', () => {
    const testUrl1 = '/api';
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YjFkYjUyYTA3NmM3YzIzNzQ0ZGMxMGQiLCJpYXQiOjE1Mjg2NzM1Nzh9.o7X7PnNfztgy6hvJEpAZbGlbpWAqwGuQclprQt3DFpg';

    it(`POST ${testUrl1}/register, should return new User`, async () => {
        const expected = {login: 'TestUser2', password: '1234'};

        const {body: {id, login, token}} = await registerUser(expected);

        assert.deepEqual({login}, {login: expected.login});

        await deleteUser(id, token);
    });

    it(`POST ${testUrl1}/login, should return existed User`, async () => {
        const expected = {login: 'TestUser2', password: '1234'};

        const {body: {id, login, token}} = await registerUser(expected);
        const {body} = await makeRequest({method: 'POST', json: expected, route: '/login', port});

        assert.deepEqual({id, login}, {id: body.id, login: body.login});

        await deleteUser(id, token);
    });

    it(`DELETE ${testUrl1}/user/:id, should delete and return Document by id`, async () => {
        const expected = {login: 'TestUser2', password: '1234'};

        const {body: {id, login, token}} = await registerUser(expected);
        const {body} = await deleteUser(id, token);

        const res = await deleteUser(id, token);


        assert.deepEqual({id, login}, {id: body.id, login: body.login});
        assert.equal(res.body.hasOwnProperty('error'), true);
    });
});