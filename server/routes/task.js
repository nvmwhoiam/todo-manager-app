import express from "express";
const router = express.Router();

import taskModel from '../models/taskSchema.js';

router.post('/create', async (req, res) => {
    try {
        const { taskData } = req.body;

        const { titleValue, descriptionValue, priorityValue, categoryValue } = taskData;

        // const apiKey = req.headers['x-api-key'];

        const taskSchema = new taskModel({
            title: titleValue,
            description: descriptionValue,
            priority: priorityValue,
            category: categoryValue
        });

        const newTask = await taskSchema.save();

        const stats = {
            totalTasks: await taskModel.countDocuments(),
            completedTasks: await taskModel.countDocuments({ completed: true }),
            pendingTasks: await taskModel.countDocuments({ completed: false })
        };

        if (newTask) {
            return res.status(200).json({
                stats,
                newTask
            });
        } else {
            return res.status(500).json({
                error: 'Failed to update todo'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/fetch', async (req, res) => {
    try {
        const { todoID } = req.body;

        const todo = await taskModel.findOne({
            _id: todoID
        });

        if (todo) {
            return res.status(200).json({
                todo
            });
        } else {
            return res.status(500).json({
                error: 'Failed to update todo'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.put('/edit', async (req, res) => {
    try {
        const { taskData } = req.body;

        const { todoID, titleValue, descriptionValue, priorityValue } = taskData;

        const taskSchema = await taskModel.findOne({ _id: todoID });
        if (!taskSchema) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        taskSchema.title = titleValue;
        taskSchema.description = descriptionValue;
        taskSchema.priority = priorityValue;

        // Save the updated todo
        const updatedTodo = await taskSchema.save();
        if (updatedTodo) {
            return res.status(200).json({
                message: 'Todo updated successfully'
            });
        } else {
            return res.status(500).json({
                error: 'Failed to update todo'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.patch('/completed', async (req, res) => {
    try {
        const { todoID } = req.body;

        // Find the todo by its ID
        const taskSchema = await taskModel.findOne({ _id: todoID });
        if (!taskSchema) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        // Toggle the 'completed' field
        taskSchema.completed = !taskSchema.completed;

        // Save the updated todo
        const updatedTodo = await taskSchema.save();

        const stats = {
            totalTasks: await taskModel.countDocuments(),
            completedTasks: await taskModel.countDocuments({ completed: true }),
            pendingTasks: await taskModel.countDocuments({ completed: false })
        };

        if (updatedTodo) {
            return res.status(200).json({
                stats,
                message: 'Todo updated successfully'
            });
        } else {
            return res.status(500).json({
                error: 'Failed to update todo'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.delete('/delete', async (req, res) => {
    try {
        const { todoID } = req.body;

        const taskSchema = await taskModel.findOne({ _id: todoID });
        if (!taskSchema) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        const deleteTodo = await taskModel.findByIdAndDelete({ _id: todoID });

        const stats = {
            totalTasks: await taskModel.countDocuments(),
            completedTasks: await taskModel.countDocuments({ completed: true }),
            pendingTasks: await taskModel.countDocuments({ completed: false })
        };

        if (deleteTodo) {
            return res.status(200).json({
                stats,
                message: 'Todo deleted successfully'
            });
        } else {
            return res.status(500).json({
                error: 'Failed to delete todo'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

export default router;