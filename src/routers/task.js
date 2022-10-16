import express from "express";
import Task from "../models/task.js";
import auth from "../middleware/auth.js";

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })

        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error.message);
    }
})

// GET /tasks?completed=false
// GET /tasks?limit=10&?skip=10
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    try {
        const match = {}
        const sort = {}

        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }

        // const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;

        const task = await Task.findOne({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send('Task Not Found');
        }

        res.send(task);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body)
        const allowedUpdates = ['description', 'completed']
        const isValidOperation = updates.every(update => allowedUpdates.includes(update))

        if (!isValidOperation) {
            return res.status(400).send({error: 'Invalid updates!'})
        }

        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send('Task not Found')
        }

        updates.forEach(update => task[update] = req.body[update])
        await task.save();

        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const _id = req.params.id;

        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send('Task not Found')
        }

        res.send(task)
    } catch (error) {
        res.status(400).send(error);
    }
})

export default router