import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import { cleanUpDatabase, generateValidJwt } from "./utils.js"
import User from '../models/user.js'

beforeEach(cleanUpDatabase);

describe('POST /users', function () {
    // test.todo('should create a user');
    it('should create a user', async function () {
        const user1 = await supertest(app)
            .post('/users')
            .send({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@gmail.com',
                password: '1234'
            })
            .expect(200)
            .expect('Content-Type', /json/)

        expect(user1.body).toBeObject();
        expect(user1.body._id).toBeString();
        expect(user1.body.firstName).toEqual('John');
        expect(user1.body.lastName).toEqual('Doe');
        expect(user1.body.email).toEqual('john.doe@gmail.com');
        expect(user1.body.role).toEqual('user');
        expect(user1.body.groups).toEqual([]);
        expect(user1.body.registrationDate).toBeString();
        expect(user1.body).toContainAllKeys(['_id', 'firstName', 'lastName', 'email', 'groups', 'role', 'registrationDate', '__v'])
    })
});

describe('GET /users', function () {
    // test.todo('should retrieve the list of users');
    let johnDoe;
    let johnnyDoey;
    beforeEach(async function () {
        // Create 2 users before retrieving the list.
        [johnDoe, johnnyDoey] = await Promise.all([
            User.create({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@gmail.com',
                password: '1234'
            }),
            User.create({
                firstName: 'Johnny',
                lastName: 'Doey',
                email: 'johnny.doey@gmail.com',
                password: '1234',
                role: 'admin'
            })
        ]);
    });


    test('should retrieve the list of users', async function () {
        const token = await generateValidJwt(johnDoe);
        const res = await supertest(app)
            .get('/users')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/);
        expect(res.body).toBeArray();
        expect(res.body).toHaveLength(2);

        expect(res.body[0]).toBeObject();
        expect(res.body[0]._id).toEqual(johnDoe.id);
        expect(res.body[0].firstName).toEqual('John');
        expect(res.body[0].lastName).toEqual('Doe');
        expect(res.body[0].email).toEqual('john.doe@gmail.com');
        expect(res.body[0].role).toEqual('user');
        expect(res.body[0].groups).toEqual([]);
        expect(res.body[0].registrationDate).toBeString();
        expect(res.body[0]).toContainAllKeys(['_id', 'firstName', 'lastName', 'email', 'groups', 'role', 'reviewPublished', 'registrationDate', '__v'])

        expect(res.body[1]).toBeObject();
        expect(res.body[1]._id).toEqual(johnnyDoey.id);
        expect(res.body[1].firstName).toEqual('Johnny');
        expect(res.body[1].lastName).toEqual('Doey');
        expect(res.body[1].email).toEqual('johnny.doey@gmail.com');
        expect(res.body[1].role).toEqual('admin');
        expect(res.body[1].groups).toEqual([]);
        expect(res.body[1].registrationDate).toBeString();
        expect(res.body[1]).toContainAllKeys(['_id', 'firstName', 'lastName', 'email', 'groups', 'role', 'reviewPublished', 'registrationDate', '__v'])
    });
});

describe('DELETE /users', function () {
    // test.todo('should retrieve the list of users');

    test('should delete a specific user', async function () {
        let johnDoe;
        let johnnyDoey;
        [johnDoe, johnnyDoey] = await Promise.all([
            User.create({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@gmail.com',
                password: '1234'
            }),
            User.create({
                firstName: 'Johnny',
                lastName: 'Doey',
                email: 'johnny.doey@gmail.com',
                password: '1234',
                role: 'admin'
            })
        ])
        const token = await generateValidJwt(johnnyDoey);
        const res = await supertest(app)
            .delete(`/users/${johnDoe.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', "text/html; charset=utf-8");

        expect(res.text).toEqual('User deleted');
    });

})

afterAll(async () => {
    await mongoose.disconnect();
});