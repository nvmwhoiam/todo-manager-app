import mongoose from 'mongoose';
import { db2Connection } from '../db.js';

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    categoryDescription: {
        type: String,
        trim: true
    },
    categoryColor: {
        type: String
    },
}, { timestamps: true });

export default db2Connection.model('Category', categorySchema);
