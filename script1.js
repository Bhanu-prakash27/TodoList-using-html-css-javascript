// To-Do List Application
class TodoApp {
    constructor() {
        // Initialize key DOM elements
        this.todoInput = document.querySelector('input[type="text"]');
        this.addButton = document.querySelector('button');
        this.todoList = document.querySelector('ul');

        // Initialize tasks array (with local storage support)
        this.tasks = JSON.parse(localStorage.getItem('todos')) || [];

        // Bind event listeners
        this.addButton.addEventListener('click', () => this.addTask());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Render initial tasks
        this.renderTasks();
    }

    // Save tasks to local storage
    saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(this.tasks));
    }

    // Add a new task
    addTask() {
        const taskText = this.todoInput.value.trim();
       
        if (taskText === '') {
            this.showNotification('Task cannot be empty!', 'error');
            return;
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        this.tasks.push(newTask);
        this.saveToLocalStorage();
        this.renderTasks();

        // Clear input and focus
        this.todoInput.value = '';
        this.todoInput.focus();

        this.showNotification('Task added successfully!', 'success');
    }

    // Render all tasks
    renderTasks() {
        // Clear existing list
        this.todoList.innerHTML = '';

        // Render each task
        this.tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                <div>
                    <small class="task-meta">${task.createdAt}</small>
                    <button class="edit-button" data-index="${index}">✏️</button>
                    <button class="delete-button" data-index="${index}">🗑️</button>
                </div>
            `;

            // Toggle complete
            li.querySelector('span').addEventListener('click', () => this.toggleComplete(index));

            // Edit task
            li.querySelector('.edit-button').addEventListener('click', () => this.editTask(index));

            // Delete task
            li.querySelector('.delete-button').addEventListener('click', () => this.deleteTask(index));

            this.todoList.appendChild(li);
        });
    }

    // Toggle task completion
    toggleComplete(index) {
        this.tasks[index].completed = !this.tasks[index].completed;
        this.saveToLocalStorage();
        this.renderTasks();
    }

    // Edit existing task
    editTask(index) {
        const task = this.tasks[index];
        const newText = prompt('Edit task:', task.text);
       
        if (newText !== null && newText.trim() !== '') {
            this.tasks[index].text = newText.trim();
            this.saveToLocalStorage();
            this.renderTasks();
            this.showNotification('Task updated successfully!', 'success');
        }
    }

    // Delete task
    deleteTask(index) {
        // Confirm deletion
        const confirmDelete = confirm('Are you sure you want to delete this task?');
       
        if (confirmDelete) {
            this.tasks.splice(index, 1);
            this.saveToLocalStorage();
            this.renderTasks();
            this.showNotification('Task deleted successfully!', 'success');
        }
    }

    // Show notification
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add to body
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
}

// Initialize the app when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// Add some additional CSS for notifications
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px;
        border-radius: 5px;
        color: white;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    }
    .notification.success {
        background-color: #2ecc71;
    }
    .notification.error {
        background-color: #e74c3c;
    }
    .completed {
        text-decoration: line-through;
        color: #95a5a6;
    }
    .task-meta {
        font-size: 0.7em;
        color: #7f8c8d;
        margin-right: 10px;
    }
`;
document.head.appendChild(style);
