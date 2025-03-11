const daySelect = document.getElementById("daySelect");
const taskList = document.getElementById("taskList");
let tasks = JSON.parse(localStorage.getItem("tasks")) || {}; // Carrega as tarefas salvas

// Função para preencher o dropdown com os dias do mês
function populateDaySelect() {
    daySelect.innerHTML = ""; // Limpa para evitar duplicatas
    for (let i = 1; i <= 30; i++) {
        let option = document.createElement("option");
        option.value = `Dia ${i}`;
        option.textContent = `Dia ${i}`;
        daySelect.appendChild(option);
    }
}

// Salvar as tarefas no LocalStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Adicionar uma nova tarefa
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
    saveTasks();
    displayTasks();  // Atualiza a lista de tarefas
}

// Alternar estado de conclusão da tarefa
function toggleTask(day, index) {
    tasks[day][index].completed = !tasks[day][index].completed;
    saveTasks();
    displayTasks();
}

// Excluir uma tarefa
function deleteTask(day, index) {
    tasks[day].splice(index, 1);
    if (tasks[day].length === 0) {
        delete tasks[day];
    }
    saveTasks();
    displayTasks();
}

// Excluir todas as tarefas de um dia
function deleteDay(day) {
    delete tasks[day];
    saveTasks();
    displayTasks();
}

// Exibir tarefas
function displayTasks() {
    taskList.innerHTML = ""; // Limpa a lista antes de recriá-la

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

            let taskButtonsDiv = document.createElement("div");
            taskButtonsDiv.classList.add("task-buttons");

            let deleteTaskBtn = document.createElement("button");
            deleteTaskBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
            deleteTaskBtn.classList.add("delete-task");
            deleteTaskBtn.onclick = () => deleteTask(day, index);

            taskButtonsDiv.appendChild(deleteTaskBtn);

            taskDiv.appendChild(checkbox);
            taskDiv.appendChild(taskSpan);
            taskDiv.appendChild(statusSpan);
            taskDiv.appendChild(taskButtonsDiv);

            tasksContainer.appendChild(taskDiv);
        });

        taskList.appendChild(dayDiv);
        taskList.appendChild(tasksContainer);
    }
}

// Carrega as tarefas ao abrir a página
window.onload = function () {
    populateDaySelect(); // Preenche o select com os dias
    displayTasks(); // Mostra as tarefas salvas
};

