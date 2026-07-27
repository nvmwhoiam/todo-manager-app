import express from "express";
const router = express.Router();

import categoryModel from '../models/categorySchema.js';
import taskModel from '../models/taskSchema.js';

router.get('/', async (req, res) => {
    try {
        const categories = await categoryModel.find();
        const tasks = await taskModel.find();

        const stats = {
            totalCategories: await categoryModel.countDocuments(),
            totalTasks: await taskModel.countDocuments(),
            completedTasks: await taskModel.countDocuments({ completed: true }),
            pendingTasks: await taskModel.countDocuments({ completed: false })
        };

        res.render('index', { categories, tasks, stats });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

export default router;