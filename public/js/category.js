import {
    setClosedToOpen,
    setClosingToClosed
} from './functions.js';

const taskTotal = document.querySelector('[data-task="total"]');
const taskCompleted = document.querySelector('[data-task="completed"]');
const taskPending = document.querySelector('[data-task="pending"]');

const modalOverlay = document.querySelector('.modal_overlay');
const createModal = document.querySelector('#todo_modal');
const editModal = document.querySelector('#todo_edit_modal');
const todoEditForm = document.querySelector('#todo_edit_form');

const taskGrid = document.querySelector('#task-container');
const taskPlaceholder = document.querySelector('#task-placeholder');


document.addEventListener('click', async (e) => {
    const checkTodoItemButton = e.target.closest('[name="todo_check"]');
    if (checkTodoItemButton) {
        const todoItem = checkTodoItemButton.closest('.todo-item');
        const todoID = todoItem.getAttribute('data-todo_id');

        await toDoUpdate(todoID);
    }

    const editTodoItemButton = e.target.closest('[data-button="todo_edit"]');
    if (editTodoItemButton) {
        const todoItem = editTodoItemButton.closest('.todo-item');
        const todoID = todoItem.getAttribute('data-todo_id');

        toDoEditData(todoID);
    }

    const deleteTodoItemButton = e.target.closest('[data-button="todo_delete"]');
    if (deleteTodoItemButton) {
        const todoItem = deleteTodoItemButton.closest('.todo-item');
        const todoID = todoItem.getAttribute('data-todo_id');

        await toDoDelete(todoID);
    }

    const addCategoryBtn = e.target.closest('[data-btn="add_todo"]');
    if (addCategoryBtn) {
        setClosedToOpen(document.querySelector('.modal_overlay'));
        setClosedToOpen(document.querySelector('#todo_modal'));
    }

    const closeModal = e.target.closest('[data-btn="close_modal"]');
    if (closeModal) {
        setClosingToClosed(modalOverlay);

        if (createModal.getAttribute('data-state') === 'open') {
            setClosingToClosed(createModal);
        } else if (editModal.getAttribute('data-state') === 'open') {
            editModal.removeAttribute('data-todo_id');
            setClosingToClosed(editModal);
            todoEditForm.reset();
        }
    }
});

document.addEventListener('submit', async (e) => {
    const todoForm = e.target.closest('[id="todo_form"]');
    if (todoForm) {
        e.preventDefault();

        const titleInput = todoForm.querySelector('[name="title"]');
        const descriptionInput = todoForm.querySelector('[name="description"]');
        const priorityInput = todoForm.querySelector('[name="priority"]');
        const categoryInput = todoForm.querySelector('[name="category"]');

        const titleValue = titleInput.value.trim();
        const descriptionValue = descriptionInput.value.trim();
        const priorityValue = priorityInput.value.trim();
        const categoryValue = categoryInput.value.trim();

        const taskData = {
            titleValue,
            descriptionValue,
            priorityValue,
            categoryValue
        }

        await toDoCreate(taskData);
    }

    const todoEditForm = e.target.closest('[id="todo_edit_form"]');
    if (todoEditForm) {
        e.preventDefault();

        const todoID = editModal.getAttribute('data-todo_id');

        const titleInput = todoEditForm.querySelector('[name="title"]');
        const descriptionInput = todoEditForm.querySelector('[name="description"]');
        const priorityInput = todoEditForm.querySelector('[name="priority"]');

        const titleValue = titleInput.value.trim();
        const descriptionValue = descriptionInput.value.trim();
        const priorityValue = priorityInput.value.trim();

        const taskData = {
            todoID,
            titleValue,
            descriptionValue,
            priorityValue
        }

        await toDoEdit(taskData);
    }
});



async function toDoCreate(taskData) {
    try {
        const response = await fetch('http://localhost:3000/task/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ taskData })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const taskDataJSON = await response.json();

        toDoCreateFeedback(taskDataJSON);

        statsGrid(taskDataJSON);



        setClosingToClosed(modalOverlay);
        setClosingToClosed(createModal);

        const taskForm = document.querySelector('form[data-form="task"]');
        if (taskForm) taskForm.reset();
    } catch (error) {
        console.log(error);
    }
}

function toDoCreateFeedback(data) {
    const { _id, title, description, priority, category, completed, createdAt } = data.newTask;

    const blockHTML = `
        <div class="todo-item" data-completed="false" data-todo_id="${_id}">
            <div class="todo-content">
                <div class="todo-main">
                    <label class="checkbox_label" aria-label="Toggle completed">
                        <div class="checkbox">
                            <input type="checkbox" name="todo_check">
                                <span class="checkbox_bg">
                                    <span class="tick_1"></span>
                                    <span class="tick_2"></span>
                                </span>
                        </div>
                    </label>

                    <div class="todo-details">
                        <div class="todo-details-header">
                            <h4 class="todo-title">
                                ${title}
                            </h4>
                            <small class="priority-badge priority-${priority}">
                                ${priority}
                            </small>

                            <p class="todo-description">
                                ${description}
                            </p>

                        </div>

                        <div class="todo-details-body">
                            <small class="created_at">
                                <i class="icon_clock-solid"></i>
                                <time>${createdAt}</time>
                            </small>
                            <small class="updated_at">
                                <i class="icon_pencil-solid"></i>
                                <time>Updated ${createdAt}</time>
                            </small>
                        </div>
                    </div>
                </div>

                <div class="todo-actions">
                    <button class="btn_icon" data-button="todo_edit" aria-label="Edit todo item">
                        <i class="icon_pencil-solid"></i>
                    </button>
                    <button class="btn_icon" data-button="todo_delete" aria-label="Delete todo item">
                        <i class="icon_trash-solid"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    if (!taskGrid) return;
    taskGrid.insertAdjacentHTML('beforeend', blockHTML);
}




async function toDoUpdate(todoID) {
    try {
        const response = await fetch('http://localhost:3000/task/completed', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ todoID })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const taskData = await response.json();

        toDoUpdateFeedback(todoID);

        statsGrid(taskData);
    } catch (error) {
        console.log(error);
    }
}

function toDoUpdateFeedback(todoID) {
    const todoItem = document.querySelector(`.todo-item[data-todo_id="${todoID}"]`);
    if (!todoItem) return;

    todoItem.classList.toggle('completed');
}



async function toDoEditData(todoID) {
    try {
        const response = await fetch('http://localhost:3000/task/fetch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ todoID })
        });

        const taskData = await response.json();

        if (response.ok) {
            toDoEditDataFeedback(taskData);
        }
    } catch (error) {
        console.log(error);
    }
}

function toDoEditDataFeedback(taskData) {
    const { _id: todoID, title, description, priority } = taskData.todo;

    const titleInput = editModal.querySelector('[name="title"]');
    const descriptionInput = editModal.querySelector('[name="description"]');
    const priorityInput = editModal.querySelector('[name="priority"]');

    titleInput.value = title;
    descriptionInput.value = description;
    priorityInput.value = priority;

    setClosedToOpen(modalOverlay);
    setClosedToOpen(editModal);

    editModal.setAttribute('data-todo_id', todoID);
}

async function toDoEdit(taskData) {
    try {
        const response = await fetch('http://localhost:3000/task/edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ taskData })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        toDoEditFeedback(taskData);



        setClosingToClosed(modalOverlay);
        setClosingToClosed(editModal);

        const taskForm = document.querySelector('form[data-form="task"]');
        if (taskForm) taskForm.reset();
    } catch (error) {
        console.log(error);
    }
}

function toDoEditFeedback(taskData) {
    const { todoID, titleValue, descriptionValue, priorityValue } = taskData;

    const todoItem = document.querySelector(`.todo-item[data-todo_id="${todoID}"]`);
    if (!todoItem) return;

    const titleElement = todoItem.querySelector('.todo-title');
    // const descriptionElement = todoItem.querySelector('.todo-description');
    const priorityElement = todoItem.querySelector('.priority-badge');

    titleElement.textContent = titleValue;
    // descriptionElement.textContent = descriptionValue;
    priorityElement.textContent = priorityValue;
}



async function toDoDelete(todoID) {
    try {
        const response = await fetch('http://localhost:3000/task/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ todoID })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const taskData = await response.json();

        toDoDeleteFeedback(todoID);

        statsGrid(taskData);
    } catch (error) {
        console.log(error);
    }
}

function toDoDeleteFeedback(todoID) {
    const todoItem = document.querySelector(`.todo-item[data-todo_id="${todoID}"]`);
    if (!todoItem) return;

    todoItem.remove();
}



function statsGrid(taskData) {
    const { totalTasks, completedTasks, pendingTasks } = taskData.stats;

    taskTotal.innerText = totalTasks;
    taskCompleted.innerText = completedTasks;
    taskPending.innerText = pendingTasks;

    if (totalTasks === 0) {
        taskPlaceholder.setAttribute('data-state', 'open');
        taskGrid.setAttribute('data-state', 'closed');
    } else {
        taskPlaceholder.setAttribute('data-state', 'closed');
        taskGrid.setAttribute('data-state', 'open');
    }
}