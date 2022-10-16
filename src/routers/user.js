import express from "express";
import User from "../models/user.js";
import auth from '../middleware/auth.js';
import multer from "multer";
import sharp from "sharp";
import {sendWelcomeEmail, sendCancellationEmail} from "../emails/account.js";

const router = new express.Router()

router.post('/users', async (req, res) => {

    try {
        const user = new User(req.body)
        await user.save()

        sendWelcomeEmail(user.email, user.name);

        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({user, token})
    } catch (error) {
        res.status(400).send(error.message)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()

        res.send('Successfully logout')
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/users/logout/all', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send('Successfully logout from all devices')
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get('/users/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;

        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send('User Not Found');
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.patch('/users/me', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name', 'email', 'password']
        const isValidOperation = updates.every(update => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({error: 'Invalid updates!'})
        }

        updates.forEach(update => req.user[update] = req.body[update])
        await req.user.save();

        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {

        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send('User not Found')
        // }

        await req.user.remove();
        sendCancellationEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (error) {
        res.status(400).send(error);
    }
})

const upload = multer({
    limits: {
        fileSize: 10000000
    }, fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)/)) {
            return callback(new Error('Please upload an image'))
        }

        callback(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("Please select a file")
    }
    const buffer = await sharp(req.file.buffer).resize(250, 250).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send('Avatar Deleted')
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('content-type', 'image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

export default router