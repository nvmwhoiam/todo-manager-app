import {
    setClosedToOpen,
    setClosingToClosed
} from './functions.js';

const categoryTotal = document.querySelector('[data-category="total"]');
const taskTotal = document.querySelector('[data-task="total"]');
const taskCompleted = document.querySelector('[data-task="completed"]');
const taskPending = document.querySelector('[data-task="pending"]');

const modalOverlay = document.querySelector('.modal_overlay');
const categoryModal = document.querySelector('#category_modal');

const categoryBody = document.querySelector('#category-body');
const categoryPlaceholder = document.querySelector('#category-placeholder');
const categoryGrid = document.querySelector('#category-grid');



document.addEventListener('click', async function (e) {
    const addCategoryBtn = e.target.closest('[data-btn="add_category"]');
    if (addCategoryBtn) {
        setClosedToOpen(modalOverlay);
        setClosedToOpen(categoryModal);
    }

    const deleteCategoryBtn = e.target.closest('[data-btn="delete_category"]');
    if (deleteCategoryBtn) {
        const categoryItem = deleteCategoryBtn.closest('.category-card');
        const categoryID = categoryItem.getAttribute('data-category_id');

        await categoryDelete(categoryID);
    }

    const closeModal = e.target.closest('[data-btn="close_modal"]');
    if (closeModal) {
        setClosingToClosed(modalOverlay);
        setClosingToClosed(categoryModal);
    }
});

document.addEventListener('submit', async (e) => {
    const categoryForm = e.target.closest('form');
    if (categoryForm && categoryForm.action.includes('/categories')) {
        e.preventDefault();

        const nameInput = categoryForm.querySelector('[name="name"]');
        const descriptionInput = categoryForm.querySelector('[name="description"]');
        const colorInput = categoryForm.querySelector('[name="color"]');

        const nameValue = nameInput.value.trim();
        const descriptionValue = descriptionInput.value.trim();
        const colorValue = colorInput.value;

        const categoryData = {
            nameValue,
            descriptionValue,
            colorValue,
        }

        await categoryCreate(categoryData);
    }
});

async function categoryCreate(categoryData) {
    try {
        const response = await fetch('http://localhost:3000/category/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ categoryData })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const categoryDataJSON = await response.json();

        categoryCreateFeedback(categoryDataJSON);

        statsGrid(categoryDataJSON);



        setClosingToClosed(modalOverlay);
        setClosingToClosed(categoryModal);

        const categoryForm = document.querySelector('form[data-form="category"]');
        if (categoryForm) categoryForm.reset();
    } catch (error) {
        console.log(error);
    }
}

function categoryCreateFeedback(categoryData) {
    const { _id, categoryName, categoryDescription, categoryColor } = categoryData.newCategory;

    const blockHTML = `
        <div class="category-card fade-in" data-category_id="${_id}">
            <div class="category-header" style="background-color: ${categoryColor};">
                <h3 class="category_name">
                    <a href="/category/${_id}" hreflang="en" aria-label="Category element">
                        ${categoryName}
                    </a>
                </h3>
                <button type="button" data-btn="delete_category" title="Delete category">
                    <i class="icon_trash-solid"></i>
                </button>
            </div>

            <div class="category-body">
                <div class="category-stats">
                    <span class="font-semibold">
                        0 tasks
                    </span>
                    <span class="font-semibold">
                        0 / 0 completed
                    </span>
                </div>

                <div class="placeholder">
                    <i class="icon_clipboard-regular"></i>
                    <p class="text-sm">No tasks yet. Click to add!</p>
                </div>
            </div>
        </div>
    `;

    if (!categoryGrid) return;
    categoryGrid.insertAdjacentHTML('beforeend', blockHTML);
}


async function categoryDelete(categoryID) {
    try {
        const response = await fetch('http://localhost:3000/category/delete', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ categoryID })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const categoryData = await response.json();

        categoryDeleteFeedback(categoryID);

        statsGrid(categoryData);
    } catch (error) {
        console.log(error);
    }
}

function categoryDeleteFeedback(categoryID) {
    const categoryItem = document.querySelector(`.category-card[data-category_id="${categoryID}"]`);
    if (!categoryItem) return;

    categoryItem.remove();
}

function statsGrid(categoryData) {
    const { totalCategories, totalTasks, completedTasks, pendingTasks } = categoryData.stats;

    categoryTotal.innerText = totalCategories;
    taskTotal.innerText = totalTasks;
    taskCompleted.innerText = completedTasks;
    taskPending.innerText = pendingTasks;

    if (totalCategories === 0) {
        categoryPlaceholder.setAttribute('data-state', 'open');
        categoryGrid.setAttribute('data-state', 'closed');
    } else {
        categoryPlaceholder.setAttribute('data-state', 'closed');
        categoryGrid.setAttribute('data-state', 'open');
    }
}