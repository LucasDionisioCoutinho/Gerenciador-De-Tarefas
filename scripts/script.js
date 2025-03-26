const daySelect = document.getElementById("daySelect");
const taskList = document.getElementById("taskList");
let tasks = JSON.parse(localStorage.getItem("tasks")) || {}; // Carrega as tarefas salvas

// Dias da semana em ordem correta
const weekDays = [
     "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
    "Quinta-feira", "Sexta-feira", "Sábado"
];
// Preenche o select com os dias da semana  
function populateDaySelect() {
    daySelect.innerHTML = "";
    weekDays.forEach(day => {
        let option = document.createElement("option");
        option.value = day;
        option.textContent = day;
        daySelect.appendChild(option);
    });
}

// Salvar as tarefas no LocalStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//MODAL

let newTaskText = ""; // Armazena temporariamente a tarefa antes da confirmação

function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskText = taskInput.value.trim();
    const selectedDay = daySelect.value;

    if (taskText === "") {
        alert("Digite uma tarefa antes de adicionar.");
        return;
    }

    // Guarda a tarefa temporariamente
    newTaskText = taskText;

    // Exibe o modal
    showRepeatTaskModal();
}

// Função para exibir o modal
function showRepeatTaskModal() {
    const modal = document.getElementById("repeatTaskModal");
    const repeatDaysContainer = document.getElementById("repeatDays");

    // Limpa e recria os checkboxes
    repeatDaysContainer.innerHTML = "";
    weekDays.forEach(day => {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = day;
        checkbox.id = `repeat-${day}`;
        
        let label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.textContent = day;

        repeatDaysContainer.appendChild(checkbox);
        repeatDaysContainer.appendChild(label);
        repeatDaysContainer.appendChild(document.createElement("br"));
    });

    modal.style.display = "flex";
}

// Fechar modal
document.getElementById("cancelRepeat").addEventListener("click", () => {
    document.getElementById("repeatTaskModal").style.display = "none";
    document.getElementById("taskInput").value = "";
});

// Confirmar repetição da tarefa
document.getElementById("confirmRepeat").addEventListener("click", () => {
    const selectedDays = [...document.querySelectorAll("#repeatDays input:checked")].map(input => input.value);
    const selectedDay = daySelect.value;

    if (!tasks[selectedDay]) {
        tasks[selectedDay] = [];
    }
    tasks[selectedDay].push({ text: newTaskText, completed: false });

    selectedDays.forEach(day => {
        if (!tasks[day]) {
            tasks[day] = [];
        }
        tasks[day].push({ text: newTaskText, completed: false });
    });

    saveTasks();
    displayTasks();

    // Esconde o modal e reseta o input
    document.getElementById("repeatTaskModal").style.display = "none";
    document.getElementById("taskInput").value = "";
});

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

// Exibe as tarefas na tela em ordem dos dias da semana
function displayTasks() {
    taskList.innerHTML = ""; // Limpa a lista antes de recriá-la

    weekDays.forEach(day => {
        if (tasks[day] && tasks[day].length > 0) {
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

            tasks[day].forEach((task, index) => {
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
                statusSpan.textContent = task.completed ? "Concluída" : "Pendente";
                statusSpan.classList.toggle("completed", task.completed);

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
    });
}

// Carrega as tarefas ao abrir a página
window.onload = function () {
    populateDaySelect(); // Preenche o select com os dias
    displayTasks(); // Mostra as tarefas salvas
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log("Service Worker registrado com sucesso!"))
    .catch(error => console.log("Erro ao registrar Service Worker:", error));
}




