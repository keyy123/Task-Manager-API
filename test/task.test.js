const Task = require("../model/task")
const app = require("../app")
const request = require("supertest")
const mongoose = require("mongoose")
const {userOne, userOneId, userTwo, userTwoId, makeDatabase, taskOne} = require("./fixtures/db")

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
    const task = await Task.findById(res.body._id)
    expect(task).not.toBeNull()
    expect(task.done).toEqual("true")
    // console.log(res.body)
})

test('Should get all tasks for a user', async()=>{
    const res = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

    // console.log(res.body.allTasks.length)
    expect(res.body.allTasks.length).toBe(2)
})

test('Should fail to delete another user\'s task', async ()=>{
    const res = request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(401)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})
