import supertest from 'supertest';
import app from "./app.js";

test('Should signup a new user', async () => {
    await supertest(app).post('/users').send({
        name: 'Andrew',
        email: 'andrew@example.com',
        password: 'MyPass777!'
    })
})
