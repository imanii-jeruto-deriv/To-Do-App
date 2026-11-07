/**
 * To-Do App
 * A simple task manager built with vanilla JavaScript.
 * Saves tasks in localStorage so they persist after refresh.
 */

// ===== Get elements =====
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearDoneBtn = document.getElementById('clearDoneBtn');
const filterBtns = document.querySelectorAll('.filter-btn');

// ===== State =====
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// ===== Save to localStorage =====
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ===== Add task =====
function addTask() {
  const text = taskInput.value.trim();

  if (text === '') {
    taskInput.focus();
    return;
  }

  const task = {
    id: Date.now(),
    text: text,
    done: false
  };

  tasks.push(task);
  taskInput.value = '';
  saveTasks();
  renderTasks();
}

// ===== Delete task =====
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

// ===== Toggle done =====
function toggleDone(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks();
    renderTasks();
  }
}

// ===== Clear done tasks =====
function clearDone() {
  tasks = tasks.filter(task => !task.done);
  saveTasks();
  renderTasks();
}

// ===== Render tasks =====
function renderTasks() {
  // Filter
  let filtered = tasks;
  if (currentFilter === 'active') {
    filtered = tasks.filter(t => !t.done);
  } else if (currentFilter === 'done') {
    filtered = tasks.filter(t => t.done);
  }

  // Clear list
  taskList.innerHTML = '';

  // Empty state
  if (filtered.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = 
      currentFilter === 'all' ? '📝 No tasks yet. Add one above!' :
      currentFilter === 'active' ? '🎉 All tasks are done!' :
      '📭 No completed tasks yet.';
    taskList.appendChild(empty);
  }

  // Build task items
  filtered.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' completed' : '');

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => toggleDone(task.id));

    // Text
    const span = document.createElement('span');
    span.className = 'task-text';
    span.textContent = task.text;

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', () => deleteTask(task.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });

  // Update count
  const remaining = tasks.filter(t => !t.done).length;
  taskCount.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} left`;
}

// ===== Filter buttons =====
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// ===== Event listeners =====
addBtn.addEventListener('click', addTask);
clearDoneBtn.addEventListener('click', clearDone);

taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// ===== Initial render =====
renderTasks();