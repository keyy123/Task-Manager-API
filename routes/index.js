const {Router} = require('express')
const User = require('../model/user')
const router = Router()
const TaskRoutes = require('./Tasks/index')
const UserRoutes = require('./Users/index')
router.get('/',(req,res)=>{
    res.send('This is the api root and welcome to Express.js')
})
const routes = [TaskRoutes, UserRoutes]
router.use(...routes)
// router.use(TaskRoutes)
// router.use(UserRoutes)
module.exports = router