// app.js
document.addEventListener('DOMContentLoaded', () => {
    
    console.log("Pokemon App Loaded. Gotta code 'em all!");

    // 2. Selecting Elements (Getting references to the HTML tags)
    const navHome = document.getElementById('nav-home');
    const navTodo = document.getElementById('nav-todo');
    const btnGetStarted = document.getElementById('get-started-btn');
    const addTaskForm = document.getElementById('add-task-form');
    const addTaskInput = document.getElementById('add-task-input');
    let selectedPriority = 'low'; // default priority

    // The two main views we want to toggle
    const heroSection = document.getElementById('hero-section');
    const progressSection = document.getElementById('progress-section');
    const taskLists = {
        todo: document.querySelector('[data-list="todo"]'),
        'in-progress': document.querySelector('[data-list="in-progress"]'),
        completed: document.querySelector('[data-list="completed"]')
    };
    let tasks = [];

    // LocalStorage key
    const STORAGE_KEY = 'pokemonTasks';

    function saveToLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        console.log("Tasks saved to localStorage");
    }

    function loadFromLocalStorage() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            tasks = JSON.parse(stored);
        }
    }

    function renderTasks() {
        console.log('Rendering tasks:', tasks);
        Object.values(taskLists).forEach(list => { if (list) list.innerHTML = ''; });

        tasks.forEach(task => {
            const listEl = taskLists[task.status];
            console.log('Rendering task:', task.title, 'to', task.status, 'found element:', listEl);
            if (!listEl) return;

            const item = document.createElement('div');
            item.className = 'task-chip';
            item.dataset.id = task.id;


            const progress = task.progress || 0;
            const priority = task.priority || 'low';
            const priorityBadges = {
                low: { icon: '🟢', label: 'Normal', color: '#78C850' },
                medium: { icon: '🟡', label: 'Important', color: '#F08030' },
                high: { icon: '🔴', label: 'Urgent', color: '#E74C3C' }
            };
            const badge = priorityBadges[priority] || priorityBadges.low;
            item.style.borderLeft = `4px solid ${badge.color}`;
            item.draggable = true;
            
            // Drag events
            item.addEventListener('dragstart', (e) => {
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', task.id);
            });
            
            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
            
            let progressHTML = '';
            if (task.status === 'in-progress') {
                progressHTML = `
                    <div class="progress-control">
                        <label class="progress-label">Progress: <span class="progress-value">${progress}%</span></label>
                        <input type="range" class="progress-slider" min="0" max="100" value="${progress}" data-id="${task.id}" />
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                `;
            }
            
            item.innerHTML = `
                <div class="task-header">
                    <span class="priority-badge" title="${badge.label}">${badge.icon} ${badge.label}</span>
                    <button class="task-label" data-action="edit" data-id="${task.id}">${task.title}</button>
                </div>
                ${progressHTML}
                <div class="task-controls">
                    <button class="status-btn to-progress" data-action="move-progress" data-id="${task.id}">In Progress</button>
                    <button class="status-btn to-completed" data-action="move-completed" data-id="${task.id}">Completed</button>
                    <button class="icon-btn edit-btn" data-action="edit" data-id="${task.id}">Edit</button>
                    <button class="icon-btn delete-btn" data-action="delete" data-id="${task.id}">Delete</button>
                </div>
            `;

            const toProgressBtn = item.querySelector('[data-action="move-progress"]');
            const toCompletedBtn = item.querySelector('[data-action="move-completed"]');

            if (task.status === 'in-progress') {
                toProgressBtn.disabled = true;
                
                const slider = item.querySelector('.progress-slider');
                const valueSpan = item.querySelector('.progress-value');
                const fillBar = item.querySelector('.progress-bar-fill');
                
                slider.addEventListener('input', (e) => {
                    const newProgress = e.target.value;
                    valueSpan.textContent = newProgress + '%';
                    fillBar.style.width = newProgress + '%';
                });
                
                slider.addEventListener('change', (e) => {
                    updateTaskProgress(task.id, e.target.value);
                });
            }

            if (task.status === 'completed') {
                toProgressBtn.disabled = true;
                toCompletedBtn.disabled = true;
            }

            listEl.appendChild(item);
        });
    }

    function createTask(title, status = 'todo', priority = 'low') {
        const newTask = {
            id: Date.now(),
            title: title,
            status: status,
            priority: priority,
            progress: 0
        };
        tasks = [newTask, ...tasks];
        console.log('Task created:', newTask);
        console.log('All tasks:', tasks);
        saveToLocalStorage();
        renderTasks();
    }

    function updateTaskStatus(id, status) {
        tasks = tasks.map(task => task.id === id ? { ...task, status } : task);
        saveToLocalStorage();
        renderTasks();
    }

    function updateTaskProgress(id, progress) {
        tasks = tasks.map(task => task.id === id ? { ...task, progress: Number(progress) } : task);
        saveToLocalStorage();
        renderTasks();
    }

    function editTask(id) {
        const task = tasks.find(t => t.id === id);
        if (!task) return;
        const updated = prompt('Edit task name:', task.title);
        if (updated === null) return;
        const trimmed = updated.trim();
        if (!trimmed) return;
        tasks = tasks.map(t => t.id === id ? { ...t, title: trimmed } : t);
        saveToLocalStorage();
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveToLocalStorage();
        renderTasks();
    }


    // 3. Defining Functions (Reusability)
    // Instead of writing the same code twice, we create functions to switch views.
    
    function showHome() {
        console.log("Switching to Home View");
        // Remove 'hidden' class from hero to show it
        heroSection.classList.remove('hidden');
        // Add 'hidden' class to progress to hide it
        progressSection.classList.add('hidden');
        
        // Update active nav state (optional visual cue)
        navHome.classList.add('active');
        navTodo.classList.remove('active');
    }

    function showProgress() {
        console.log("Switching to Progress View");
        // Hide hero
        heroSection.classList.add('hidden');
        // Show progress
        progressSection.classList.remove('hidden');

        // Update active nav state
        navHome.classList.remove('active');
        navTodo.classList.add('active');
    }


    // 4. Event Listeners (Waiting for user interaction)
    
    // When "HOME" is clicked...
    navHome.addEventListener('click', (e) => {
        e.preventDefault(); // Stops the link from jumping to the top of the page
        showHome();
    });

    // When "TO DO" is clicked...
    navTodo.addEventListener('click', (e) => {
        e.preventDefault();
        showProgress();
    });

    // When the big "GET STARTED" button is clicked...
    // It makes sense for this button to lead to the main app dashboard.
    btnGetStarted.addEventListener('click', () => {
        showProgress();
    });

    // Add task form
    if (addTaskForm) {
        // Priority button selection
        const priorityButtons = addTaskForm.querySelectorAll('.priority-btn');
        priorityButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                priorityButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedPriority = btn.dataset.priority;
                console.log('Priority selected:', selectedPriority);
            });
        });
        priorityButtons[0].classList.add('active'); // default to low

        addTaskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const value = addTaskInput.value.trim();
            if (!value) return;
            console.log('Submit clicked - creating task in TODO');
            createTask(value, 'todo', selectedPriority);
            addTaskInput.value = '';
        });

        const addToProgressBtn = document.getElementById('add-to-progress');
        const addToCompletedBtn = document.getElementById('add-to-completed');
        
        console.log('Progress button found:', addToProgressBtn);
        console.log('Completed button found:', addToCompletedBtn);
        
        if (addToProgressBtn) {
            addToProgressBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const value = addTaskInput.value.trim();
                console.log('In Progress button clicked, value:', value);
                if (!value) return;
                createTask(value, 'in-progress', selectedPriority);
                addTaskInput.value = '';
            });
        }
        
        if (addToCompletedBtn) {
            addToCompletedBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const value = addTaskInput.value.trim();
                console.log('Completed button clicked, value:', value);
                if (!value) return;
                createTask(value, 'completed', selectedPriority);
                addTaskInput.value = '';
            });
        }
    }

    // Task action handling (status changes, edit, delete)
    progressSection.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        const id = Number(e.target.dataset.id);
        if (!action || Number.isNaN(id)) return;

        if (action === 'move-progress') return updateTaskStatus(id, 'in-progress');
        if (action === 'move-completed') return updateTaskStatus(id, 'completed');
        if (action === 'edit') return editTask(id);
        if (action === 'delete') return deleteTask(id);
    });

    /* Professor Note on the Slider:
    The slider at the bottom of your design is currently static HTML/CSS 
    just to match the mockup visually. 
    Making it functional would require significantly more complex Javascript 
    (calculating scroll positions or using a carousel library like Swiper.js). 
    For this stage of development, keeping it visual is appropriate.
    */

    // Setup drag and drop for task lists
    function setupDragAndDrop() {
        Object.entries(taskLists).forEach(([status, listEl]) => {
            if (!listEl) return;
            
            listEl.addEventListener('dragover', (e) => {
                e.preventDefault();
                listEl.classList.add('drag-over');
                
                const afterElement = getDragAfterElement(listEl, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (draggable) {
                    if (afterElement == null) {
                        listEl.appendChild(draggable);
                    } else {
                        listEl.insertBefore(draggable, afterElement);
                    }
                }
            });
            
            listEl.addEventListener('dragleave', (e) => {
                if (!listEl.contains(e.relatedTarget)) {
                    listEl.classList.remove('drag-over');
                }
            });
            
            listEl.addEventListener('drop', (e) => {
                e.preventDefault();
                listEl.classList.remove('drag-over');
                const draggable = document.querySelector('.dragging');
                if (draggable) {
                    const taskId = Number(draggable.dataset.id);
                    updateTaskStatus(taskId, status);
                }
            });
        });
    }
    
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-chip:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Initial load from localStorage
    loadFromLocalStorage();
    renderTasks();
    setupDragAndDrop();

});