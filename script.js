let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    let text = document.getElementById("taskInput").value;
    let dueDate = document.getElementById("dueDate").value;
    let priority = document.getElementById("priority").value;
    let category = document.getElementById("category").value;

    if(text === "") return;

    tasks.push({
        text,
        dueDate,
        priority,
        category,
        completed:false
    });

    saveTasks();
    displayTasks();
    document.getElementById("taskInput").value = "";
}

function displayTasks() {
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    let filteredTasks = tasks.filter(task => {
        if(filter === "completed") return task.completed;
        if(filter === "pending") return !task.completed;
        return true;
    });

    if(filteredTasks.length === 0) {
        document.getElementById("emptyMsg").style.display = "block";
    } else {
        document.getElementById("emptyMsg").style.display = "none";
    }

    filteredTasks.forEach((task,index) => {
        let li = document.createElement("li");
        li.className = task.completed ? "completed" : "";

        li.innerHTML = `
            <span>
            ${task.text} <br>
            ${task.category} | ${task.priority} | ${task.dueDate}
            </span>

            <div>
                <button onclick="toggleComplete(${index})">✔</button>
                <button onclick="editTask(${index})">✏</button>
                <button onclick="deleteTask(${index})">🗑</button>
            </div>
        `;

        list.appendChild(li);
    });

    updateProgress();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    displayTasks();
}

function deleteTask(index) {
    if(confirm("Delete this task?")) {
        tasks.splice(index,1);
        saveTasks();
        displayTasks();
    }
}

function editTask(index) {
    let newTask = prompt("Edit task", tasks[index].text);
    if(newTask) {
        tasks[index].text = newTask;
        saveTasks();
        displayTasks();
    }
}

function filterTasks(type) {
    filter = type;
    displayTasks();
}

function updateProgress() {
    let completed = tasks.filter(t => t.completed).length;
    let total = tasks.length;
    let percent = total === 0 ? 0 : (completed/total)*100;
    document.getElementById("progressBar").style.width = percent + "%";
}

document.getElementById("search").addEventListener("input", function() {
    let value = this.value.toLowerCase();
    let list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.filter(t => t.text.toLowerCase().includes(value))
    .forEach((task,index) => {
        let li = document.createElement("li");
        li.innerHTML = task.text;
        list.appendChild(li);
    });
});

document.getElementById("darkToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

if(localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
}

function exportTasks() {
    let data = JSON.stringify(tasks);
    let blob = new Blob([data], {type:"text/plain"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tasks.txt";
    a.click();
}

displayTasks();

new Sortable(taskList, {
    animation: 150,
    onEnd: function () {
        let reordered = [];
        document.querySelectorAll("#taskList li").forEach(li => {
            let text = li.innerText.split("\n")[0];
            let task = tasks.find(t => t.text === text);
            reordered.push(task);
        });
        tasks = reordered;
        saveTasks();
    }
});