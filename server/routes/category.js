import express from "express";
const router = express.Router();

import categoryModel from '../models/categorySchema.js';
import taskModel from '../models/taskSchema.js';

router.get('/:id', async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id);
        if (!category) {
            return res.status(404).send('Category not found');
        }

        const tasks = await taskModel.find({
            category: req.params.id
        }).sort({ createdAt: -1 });

        res.render('category', { category, tasks });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.post('/create', async (req, res) => {
    try {
        const { categoryData } = req.body;

        const { nameValue, descriptionValue, colorValue } = categoryData;

        // const apiKey = req.headers['x-api-key'];

        const categorySchema = new categoryModel({
            categoryName: nameValue,
            categoryDescription: descriptionValue,
            categoryColor: colorValue
        });

        const newCategory = await categorySchema.save();

        const stats = {
            totalCategories: await categoryModel.countDocuments(),
            totalTasks: await taskModel.countDocuments(),
            completedTasks: await taskModel.countDocuments({ completed: true }),
            pendingTasks: await taskModel.countDocuments({ completed: false })
        };

        if (newCategory) {
            return res.status(200).json({
                stats,
                newCategory
            });
        } else {
            return res.status(500).json({
                error: 'Failed to create category'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

router.delete('/delete', async (req, res) => {
    try {
        const { categoryID } = req.body;

        const fetchCategory = await categoryModel.findOne({ _id: categoryID });
        if (!fetchCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        const deleteCategory = await categoryModel.findOneAndDelete({ _id: categoryID });
        const deleteTasks = await taskModel.deleteMany({ category: categoryID });

        const stats = {
            totalCategories: await categoryModel.countDocuments(),
            totalTasks: await taskModel.countDocuments(),
            completedTasks: await taskModel.countDocuments({ completed: true }),
            pendingTasks: await taskModel.countDocuments({ completed: false })
        };

        if (deleteCategory) {
            return res.status(200).json({
                stats,
                message: 'Category deleted successfully'
            });
        } else {
            return res.status(500).json({
                error: 'Failed to delete category'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

export default router;