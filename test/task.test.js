const Task = require("../model/task")
const app = require("../app")
const request = require("supertest")
const mongoose = require("mongoose")
const {userOne, userOneId, makeDatabase} = require("./fixtures/db")

beforeEach(makeDatabase)

test('Should create a new task', async ()=>{
    const res = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
        details: "Testing",
        done: true
    })
    .expect(200)
})

