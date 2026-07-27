# Todo List Manager

A powerful task management application that helps you organize your life through color-coded categories. Create custom categories for different areas of your life (work, personal, health, etc.), set priority levels for each task, and track your progress with visual statistics. Built with a modern, responsive interface that works seamlessly across all devices.

## Features

- **Category Management**: Create and organize todos by custom categories with custom colors and descriptions
- **Todo CRUD Operations**: Add, edit, toggle completion, and delete todos
- **Priority Levels**: Set todos as low, medium, or high priority with visual indicators
- **Statistics Dashboard**: Real-time stats showing total categories, todos, completed, and pending items
- **Category-Specific Views**: View and manage todos within each category
- **Progress Tracking**: Visual progress bars showing completion percentage per category
- **Mobile Responsive**: Fully responsive design that works on all devices
- **Modern UI**: Clean, modern interface with smooth animations and transitions
- **Modal-Based Forms**: Elegant modal dialogs for creating and editing items
- **Real-Time Updates**: Dynamic DOM updates without page refreshes
- **Interactive Elements**: Hover effects, animations, and user-friendly interactions

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: EJS templating, HTML5, SCSS (compiled to CSS), JavaScript (ES6+ modules)
- **Additional**: Method-override for PUT/DELETE support, CORS for cross-origin requests 

## Installation

1. **Clone the repository**
   ```bash
   git clone todo-manager-app
   cd todo-manager-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/todo-manager-app
     ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Default connection: `mongodb://localhost:27017/todo-manager-app`

5. **Start the application**
   ```bash
   npm run devStart
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:3000`

## Usage

### Creating Categories
1. Click the "Add category" button on the home page
2. Enter a category name and optional description
3. Choose a color for the category using the color picker
4. Click "Create Category"
5. The new category card will appear in the grid

### Managing Todos
1. Click on a category to view its todos
2. Click "Add task" to create a new todo
3. Enter a task title and optional description
4. Set priority level (Low, Medium, High)
5. Click "Add Task"
6. Use the checkbox to mark tasks as complete
7. Click the pencil icon to edit task details
8. Click the trash icon to delete tasks

### Deleting Categories
1. Click the trash icon on a category card
2. This will delete the category and all its todos

### Statistics
The dashboard shows:
- Total number of categories
- Total number of todos
- Number of completed todos
- Number of pending todos

## Project Structure

```
todo-manager-app/
├── server/
│   ├── models/
│   │   ├── Category.js      # Category model
│   │   └── Todo.js         # Todo model
│   ├── routes/
│   │   ├── index.js        # Home route
│   │   ├── category.js     # Category routes
│   │   └── todo.js         # Todo routes
│   ├── db.js              # Database connection
│   └── server.js          # Main server file
├── views/
│   ├── index.ejs          # Home page template
│   ├── category.ejs       # Category detail page
│   └── partials/
│       ├── category-item.ejs  # Category card component
│       └── todo-item.ejs      # Todo item component
├── public/
│   ├── css/
│   │   ├── index.css       # Home page styles
│   │   ├── category.css    # Category page styles
│   │   └── general/        # Shared styles
│   ├── js/
│   │   ├── index.js        # Home page logic
│   │   ├── category.js     # Category page logic
│   │   └── functions.js    # Shared utility functions
│   └── fonts/              # Custom fonts
├── .env                    # Environment variables
├── package.json            # Dependencies
└── README.md               # This file
```

## API Endpoints

- `GET /` - Home page with all categories and todos
- `GET /category/:id` - Category detail page with todos
- `POST /category/create` - Create new category
- `DELETE /category/delete` - Delete category and all its todos
- `POST /todo/create` - Create new todo
- `POST /todo/fetch` - Fetch single todo by ID
- `PUT /todo/edit` - Update todo details
- `PATCH /todo/completed` - Toggle todo completion status
- `DELETE /todo/delete` - Delete todo

## Features Details

### Category Management
- Custom colors for visual organization
- Optional descriptions for context
- Delete category with confirmation (also deletes all todos in category)

### Todo Features
- Title and optional description
- Three priority levels with color coding
- Checkbox for completion status
- Individual todo deletion
- Automatic timestamp tracking

### UI/UX Features
- Responsive grid layout for categories
- Smooth animations and transitions
- Hover effects on interactive elements
- Modal-based forms for creating/editing
- Real-time DOM updates without page refresh
- Progress bars showing completion percentage
- Color-coded priority indicators
- Mobile-optimized touch targets
- Empty state messages for better UX

## Contact

If you have any questions or need assistance, please do not hesitate to reach out. I apologize if any part of this setup is not clear; this is my first major project, and I am putting in continuous effort to improve it. Feel free to contact me at [info@sadevworks.com](mailto:info@sadevworks.com) or open an issue on the [GitHub Repository](https://github.com/nvmwhoiam/todo-manager-app).

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## Author

- Email: [info@sadevworks.com](mailto:info@sadevworks.com)
- Website: [sadevworks.com](https://sadevworks.com)
- GitHub: [@nvmwhoiam](https://github.com/nvmwhoiam/)
