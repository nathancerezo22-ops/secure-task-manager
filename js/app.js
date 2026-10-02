// Global state counter for unique task ID generation
let taskIdCounter = 1;

// DOM Elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

/**
 * Creates and returns a single <li class="task-item"> element.
 * Does not attach the item to #taskList.
 */
function createTaskElement(taskText, taskId) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.taskId = taskId;
  li.dataset.state = "pending";

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = taskText;

  const completeBtn = document.createElement("button");
  completeBtn.className = "complete-btn";
  completeBtn.textContent = "Complete";

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "Edit";

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-btn";
  removeBtn.textContent = "Remove";

  li.appendChild(span);
  li.appendChild(completeBtn);
  li.appendChild(editBtn);
  li.appendChild(removeBtn);

  return li;
}

/**
 * Validates text, generates an ID, appends task to #taskList,
 * clears input/errors, and updates summary counts.
 */
function addTask(taskText) {
  const trimmedText = taskText.trim();

  if (trimmedText === "") {
    taskMessage.textContent = "Task cannot be empty";
    return;
  }

  taskMessage.textContent = "";

  const taskId = `task-${taskIdCounter++}`;
  const taskElement = createTaskElement(trimmedText, taskId);

  taskList.appendChild(taskElement);
  taskInput.value = "";
  updateTaskCounts();
}

/**
 * Toggles the completed state using classList and updates data-state.
 */
function toggleTaskComplete(taskItem) {
  taskItem.classList.toggle("completed");
  const isCompleted = taskItem.classList.contains("completed");
  taskItem.dataset.state = isCompleted ? "completed" : "pending";
  updateTaskCounts();
}

/**
 * Replaces the task text span with an edit input and renames the Edit button to Save.
 */
function beginTaskEdit(taskItem) {
  const textSpan = taskItem.querySelector(".task-text");
  if (!textSpan) return;

  const currentText = textSpan.textContent;
  const editInput = document.createElement("input");
  editInput.className = "edit-input";
  editInput.type = "text";
  editInput.value = currentText;

  taskItem.replaceChild(editInput, textSpan);

  const editBtn = taskItem.querySelector(".edit-btn");
  if (editBtn) {
    editBtn.textContent = "Save";
  }
}

/**
 * Validates the edit input, replaces it with a safe span, and changes button back to Edit.
 */
function saveTaskEdit(taskItem) {
  const editInput = taskItem.querySelector(".edit-input");
  if (!editInput) return;

  const updatedText = editInput.value.trim();

  if (updatedText === "") {
    taskMessage.textContent = "Task cannot be empty";
    return;
  }

  taskMessage.textContent = "";

  const newSpan = document.createElement("span");
  newSpan.className = "task-text";
  newSpan.textContent = updatedText;

  taskItem.replaceChild(newSpan, editInput);

  const editBtn = taskItem.querySelector(".edit-btn");
  if (editBtn) {
    editBtn.textContent = "Edit";
  }
}

/**
 * Removes the selected task element from the DOM and updates counts.
 */
function removeTask(taskItem) {
  taskItem.remove();
  updateTaskCounts();
}

/**
 * Calculates and updates summary counters dynamically from DOM state.
 */
function updateTaskCounts() {
  const allTasks = taskList.querySelectorAll(".task-item");
  const total = allTasks.length;

  let pending = 0;
  let completed = 0;

  allTasks.forEach((item) => {
    if (item.dataset.state === "completed") {
      completed++;
    } else {
      pending++;
    }
  });

  totalCount.textContent = total;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
}

/**
 * Single delegated click handler attached to #taskList.
 */
function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest(".task-item");

  if (!taskItem) return;

  if (target.matches(".complete-btn")) {
    toggleTaskComplete(taskItem);
  } else if (target.matches(".edit-btn")) {
    if (target.textContent === "Edit") {
      beginTaskEdit(taskItem);
    } else if (target.textContent === "Save") {
      saveTaskEdit(taskItem);
    }
  } else if (target.matches(".remove-btn")) {
    removeTask(taskItem);
  }
}

/**
 * Batches batch insertion using DocumentFragment for sample tasks.
 */
function loadSampleTasks() {
  const sampleTexts = [
    "Review DOM selectors",
    "Practice createElement",
    "Study event delegation"
  ];

  const fragment = document.createDocumentFragment();

  sampleTexts.forEach((text) => {
    const taskId = `task-${taskIdCounter++}`;
    const taskElement = createTaskElement(text, taskId);
    fragment.appendChild(taskElement);
  });

  taskList.appendChild(fragment);
  taskMessage.textContent = "";
  updateTaskCounts();
}

// Event Listeners Initialization
document.addEventListener("DOMContentLoaded", () => {
  // Attach single event delegation listener to task list
  taskList.addEventListener("click", handleTaskListClick);

  // Add Task button click
  addTaskBtn.addEventListener("click", () => {
    addTask(taskInput.value);
  });

  // Optional: Allow 'Enter' key press in task input to add task
  taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addTask(taskInput.value);
    }
  });

  // Load sample tasks button click
  loadSamplesBtn.addEventListener("click", loadSampleTasks);

  // Initial counts setup
  updateTaskCounts();
});