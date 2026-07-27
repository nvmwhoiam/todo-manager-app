import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
import './db.js';

const app = express();

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Define allowed origins for CORS
const allowedOrigins = [
    'http://127.0.0.1:5500',
    'http://localhost:3000'
];

// CORS options configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    credentials: true
};

// Use the CORS middleware to handle cross-origin requests
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

import indexRoute from "./routes/index.js";
import categoryRoute from "./routes/category.js";
import taskRoute from "./routes/task.js";

app.use("/", indexRoute);
app.use("/category", categoryRoute);
app.use("/task", taskRoute);

// Set up the port to listen on, using the value from the environment variable PORT or defaulting to port 3000
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, (error) => {
    if (error) {
        console.error('Error starting server:', error);
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});
