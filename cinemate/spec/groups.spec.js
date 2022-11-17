import supertest from "supertest"
import app from "../app.js"
import mongoose from "mongoose"
import { cleanUpDatabase, generateValidJwt } from "./utils.js"
import User from '../models/user.js'

beforeEach(cleanUpDatabase);

describe('POST /groups', function () {
    // test.todo('should create a user');
    // test.todo('should retrieve the list of users');
    let johnDoe;
    beforeEach(async function () {
        // Create 2 users before retrieving the list.
        [johnDoe] = await Promise.all([
            User.create({
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@gmail.com',
                password: '1234'
            })
        ]);
    });

    it('should create a group', async function () {

        const token = await generateValidJwt(johnDoe);
        const group = await supertest(app)
            .post('/groups')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'groupe test',
                description: 'bla bla bla',
                password: '1234'
            })
            .expect(200)
            .expect('Content-Type', /json/)

        expect(group.body).toBeObject();
        expect(group.body._id).toBeString();
        expect(group.body.name).toEqual('groupe test');
        expect(group.body.description).toEqual('bla bla bla');
        expect(group.body).toContainAllKeys(['_id', 'name', 'description', '__v'])
    })
});


afterAll(async () => {
    await mongoose.disconnect();
});