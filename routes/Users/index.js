const {Router} = require('express')
const router = Router()
const auth = require('../../middleware/auth')
const User = require("../../model/user")
const multer = require("multer")
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancellationEmail} = require("../../email/account")
router.post("/users", async (req,res)=>{
   
const newUser = new User(req.body)
try{
    await newUser.save()
    sendWelcomeEmail(newUser.email, newUser.name)
    const token = await newUser.generateAuthToken()
    res.status(201).send({newUser, token})
}catch(e){
    res.status(400).send(e)
}
})

router.post("/users/login", async (req, res)=>{
    try{
      let user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    }catch(e){
        res.status(400).send()
        console.log(e)
    }
})


router.get("/users/me", auth, async (req, res)=>{
    try{
        const user = req.user
    if(!user){
        return res.status(404).send();
    }
    res.status(200).send(user);
    }catch(e){
        res.status(404).send(e);
    }
    })
    
    
router.post("/users/logout", auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})


router.post("/users/logoutall", auth, async (req, res)=>{
    try{
        // req.user.tokens = req.user.tokens.filter((token)=>{
        //     return token.token !== token.token
        // })
        //Both identical but this is less wordy
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})
    // router.get("/users/:id", auth, async(req,res)=> {
    //     let id = req.params.id;
    //     try{
    //         const user = await User.findById(id)
    //         console.log(user)
    //         if(!user){
    //             return res.status(404).send()
    //         }
    //         res.send(user)
    //     }catch(e){
    //         res.status(500).send()
    //     }
    // })
    
    

    
    router.patch("/users/me", auth, async(req,res)=>{
        let updates = Object.keys(req.body)
        let allowedUpdates = ['name','age','password']
        let isTrue = updates.every((update)=> allowedUpdates.includes(update))
        if(!isTrue){
            return res.status(400).send()
        }
            try{
             
                // let user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidator:true})
                // let user = await User.findById(req.params.id)
                updates.forEach((x)=>req.user[x] = req.body[x])
                await req.user.save()
             
                //  if(!user){
                //      return res.status(404).send()
                //  }
                 res.send(req.user)
            }catch(e){
                res.status(400).send(e)
            }
        })
        
    router.delete("/users/me", auth,  async(req,res)=>{
        try{
            // const user = await User.findByIdAndDelete(req.params.id)
            // if(!user){
            //     return res.status(404).send()
            // }
            await req.user.remove()
            sendCancellationEmail(req.user.name, req.user.email)
            res.send(req.user)
        }catch(e){
            res.status(500).send()
        }
    })
    
    const upload = multer({
        // dest:"avatars", w/o dest we have a new prop on req.file called buffer which we can use with Mongoose
        limits:{
            fileSize: 1000000
        },
        fileFilter(req, file, cb){
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
                return cb(new Error("Please upload a JPG, JPEG or PNG image"))
            }
            cb(null, true)
        }
    })

    router.post("/users/me/avatar", auth, upload.single('avatar'), async (req,res)=>{
        const buffer = await sharp(req.file.buffer).resize({width:250}).png().toBuffer()
        req.user.profile = buffer
        await req.user.save()
        res.send()
    },(error, req, res, next)=>{
        res.status(400).send({error:error.message})
    })

    router.delete("/users/me/avatar", auth, async(req, res)=>{
        try{
        req.user.profile = undefined
        await req.user.save()
        res.send()
        }catch(e){
            res.status(500).send({e:e.message})
        }
    })

    router.get("/users/:id/avatar", async(req, res)=>{
        try{
            const user = await User.findById(req.params.id)
            if(!user||!user.profile){
                throw new Error("Could not find profile of undefined")
            }
            res.set("Content-Type","image/png")
            res.send(user.profile)
        }catch(e){
            res.status(404).send()
        }
    })



    module.exports = router