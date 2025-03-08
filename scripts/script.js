const daySelect = document.getElementById("daySelect");
const taskList = document.getElementById("taskList");
let tasks = JSON.parse(localStorage.getItem("tasks")) || {}; // Carrega as tarefas salvas

// Preenche o dropdown com os dias do mês
for (let i = 1; i <= 30; i++) {
    let option = document.createElement("option");
    option.value = `Dia ${i}`;
    option.textContent = `Dia ${i}`;
    daySelect.appendChild(option);
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks)); // Salva no localStorage
}

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    const selectedDay = daySelect.value;

    if (taskText === "") {
        alert("Digite uma tarefa antes de adicionar.");
        return;
    }

    if (!tasks[selectedDay]) {
        tasks[selectedDay] = [];
    }

    tasks[selectedDay].push({ text: taskText, completed: false });
    taskInput.value = "";
    saveTasks();  // Salva ao adicionar tarefa
    displayTasks();
}

function toggleTask(day, index) {
    tasks[day][index].completed = !tasks[day][index].completed;
    saveTasks();  // Salva ao marcar como concluída
    displayTasks();
}

function deleteTask(day, index) {
    tasks[day].splice(index, 1);
    if (tasks[day].length === 0) {
        delete tasks[day]; // Remove o dia se não houver tarefas
    }
    saveTasks();  // Salva ao excluir
    displayTasks();
}

function deleteDay(day) {
    delete tasks[day];
    saveTasks();  // Salva ao excluir o dia
    displayTasks();
}

function displayTasks() {
    taskList.innerHTML = "";

    for (const [day, taskArray] of Object.entries(tasks)) {
        let dayDiv = document.createElement("div");
        dayDiv.classList.add("day");

        let dayTitle = document.createElement("span");
        dayTitle.textContent = day;

        let deleteDayBtn = document.createElement("button");
        deleteDayBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteDayBtn.classList.add("delete-day");
        deleteDayBtn.onclick = () => deleteDay(day);

        dayDiv.appendChild(dayTitle);
        dayDiv.appendChild(deleteDayBtn);

        let tasksContainer = document.createElement("div");
        tasksContainer.classList.add("tasks-container");

        taskArray.forEach((task, index) => {
            let taskDiv = document.createElement("div");
            taskDiv.classList.add("task");

            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.checked = task.completed;
            checkbox.classList.add("checkbox");
            checkbox.onclick = () => toggleTask(day, index);

            let taskSpan = document.createElement("span");
            taskSpan.textContent = task.text;
            if (task.completed) {
                taskSpan.classList.add("completed");
            }

            let statusSpan = document.createElement("span");
            statusSpan.classList.add("status");
            if (task.completed) {
                statusSpan.classList.add("completed");
                statusSpan.textContent = "Concluída";
            }

            let deleteTaskBtn = document.createElement("button");
            deleteTaskBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            deleteTaskBtn.classList.add("delete-task");
            deleteTaskBtn.onclick = () => deleteTask(day, index);

            taskDiv.appendChild(checkbox);
            taskDiv.appendChild(taskSpan);
            taskDiv.appendChild(statusSpan);
            taskDiv.appendChild(deleteTaskBtn);

            tasksContainer.appendChild(taskDiv);
        });

        taskList.appendChild(dayDiv);
        taskList.appendChild(tasksContainer);
    }
}

// Carrega as tarefas ao abrir a página
window.onload = function () {
    displayTasks();
};

