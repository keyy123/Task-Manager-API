const request = require("supertest")
const app = require("../app.js")
const User = require("../model/user")
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {userOne, userOneId, makeDatabase} = require('./fixtures/db')
//User id and user object were taken

beforeEach(makeDatabase)


describe('Testing non-auth\'d user POST routes', ()=>{
    test('Should sign up a new user', async () => {
        const res = await request(app).post("/users").send({
            name: "jasmine",
            email: "jaz119@gmail.com",
            password: "2222222",
            tokens: []
        }).expect(201)
        // console.log(res.body)
        const user = await User.findById(res.body.newUser._id) //no user with the id = null so Mongoose can't find Jasmine's document
        expect(user).not.toBeNull()
    
        // //This works for individual props but it sucks if you are trying to test many props
        expect(res.body.newUser.name).toBe('jasmine')
    
        expect(res.body).toMatchObject({
            newUser:{
                name: 'jasmine',
                email: 'jaz119@gmail.com'
            },
            token: res.body.token
        })
    })


    test('Should login existing user', async ()=>{
        const res = await request(app).post("/users/login")
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200)
        // console.log(res.body.token)
        const user = await User.findById(res.body.user._id)
        // console.log(user.tokens[1].token)
        expect(res.body.token).toBe(user.tokens[1].token)
    })

test('Should not login nonexistent user', async()=>{
    await request(app).post("/users/login").send({
        email: userOne.email + 21345,
        password: "password"
    }).expect(400)
})
})
describe('Testing user GET routes', ()=>{
test('Should get profile for user', async()=>{
    await request(app)
    .get("/users/me")
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async()=>{
    await request(app)
    .get("/users/me")
    .send()
    .expect(401)
})
})

describe('Testing user DELETE routes', () => {
test('Should delete user account', async ()=>{
   const res = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)   
    // console.log(res.body)
    const user = await User.findById(res.body._id)
    expect(user).toBe(null)
})

test('Should not delete account for unauthenticated user', async ()=>{
    await request(app)
    .delete("/users/me")
    .send()
    .expect(401)
})
})

test('Should upload an image', async () => {
    // try{
    await request(app).post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', "test/fixtures/WIN_20220104_04_33_57_Pro.jpg")
    .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.profile).toEqual(expect.any(Buffer))
})

test('Should update user fields', async()=>{
    await request(app).patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({"name":"Kheyyon"})
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toBe("Kheyyon")
})

test('Should not update invalid user fields', async ()=>{
    await request(app).patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({"location":"Home"})
    .expect(400)
})