const TEACHER_PASS = "9907";

let exams = [examen1, examen2, examen3, examen4, examen5];

let currentExam;
let currentQuestion = 0;
let answers = [];
let cheating = false;

/* LOGIN */
function login(){
    let user = userInput.value;
    let pass = passInput.value;

    let users = JSON.parse(localStorage.getItem("users")||"{}");

    if(!users[user] || users[user].pass !== pass){
        alert("Datos incorrectos");
        return;
    }

    localStorage.setItem("currentUser", user);

    showExamSelector();
}

/* PANEL DE EXÁMENES */
function showExamSelector(){
    let html = `<div class="center"><h1>Selecciona examen</h1>`;

    exams.forEach((ex,i)=>{
        html += `<button onclick="selectExam(${i})">${ex.title}</button>`;
    });

    html += `</div>`;

    document.body.innerHTML = html;
}

function selectExam(i){
    currentExam = exams[i];
    currentQuestion = 0;
    answers = [];
    cheating = false;

    startExam();
}

/* EXAMEN */
function startExam(){

    document.addEventListener("visibilitychange", ()=>{
        if(document.hidden){
            cheating = true;
            finishExam();
        }
    });

    renderQuestion();
}

function renderQuestion(){

    let q = currentExam.questions[currentQuestion];

    let html = `
    <div class="exam">
        <div class="left">
            ${q.q}
        </div>

        <div class="right">
    `;

    q.o.forEach((opt,i)=>{
        let selected = answers[currentQuestion] === i ? "selected" : "";

        html += `
        <div class="option ${selected}" onclick="selectAnswer(${i})">
            ${opt}
        </div>`;
    });

    html += `
        <button onclick="next()">Siguiente</button>
        </div>
    </div>`;

    document.body.innerHTML = html;
}

function selectAnswer(i){
    answers[currentQuestion] = i;
    renderQuestion();
}

function next(){
    if(currentQuestion < currentExam.questions.length -1){
        currentQuestion++;
        renderQuestion();
    } else {
        finishExam();
    }
}

/* FINAL */
function finishExam(){

    let correct = 0;

    currentExam.questions.forEach((q,i)=>{
        if(answers[i] === q.c) correct++;
    });

    let finalScore = cheating ? 0 : correct;
    let knowledge = cheating ? 0 : (correct / currentExam.questions.length) * 100;

    let user = localStorage.getItem("currentUser");

    let results = JSON.parse(localStorage.getItem("results")||"[]");

    results.push({
        user,
        exam: currentExam.title,
        score: finalScore,
        total: currentExam.questions.length,
        knowledge: knowledge.toFixed(2)+"%",
        cheating
    });

    localStorage.setItem("results", JSON.stringify(results));

    alert(cheating ? "Reprobado por trampa" : "Examen terminado");

    location.reload();
}

/* MAESTRO */
function teacherLogin(){
    let pass = prompt("Contraseña:");
    if(pass !== TEACHER_PASS) return alert("Incorrecta");

    openPanel();
}

function openPanel(){
    let html = `
    <div style="padding:30px;">
        <h1>Panel Maestro</h1>

        <button onclick="register()">Registrar alumno</button>
        <button onclick="location.reload()">Volver</button>

        <h2>Resultados</h2>
        <table border="1">
        <tr>
            <th>Cuenta</th>
            <th>Examen</th>
            <th>Calificación</th>
            <th>Conocimiento</th>
            <th>Estado</th>
        </tr>
    `;

    let results = JSON.parse(localStorage.getItem("results")||"[]");

    results.forEach(r=>{
        html += `
        <tr>
            <td>${r.user}</td>
            <td>${r.exam}</td>
            <td>${r.score}/${r.total}</td>
            <td>${r.knowledge}</td>
            <td>${r.cheating ? "⛔" : "OK"}</td>
        </tr>`;
    });

    html += `</table></div>`;

    document.body.innerHTML = html;
}

/* REGISTRO (SOLO MAESTRO) */
function register(){
    let user = prompt("No. Cuenta:");
    let name = prompt("Nombre:");
    let pass = prompt("Contraseña:");

    let users = JSON.parse(localStorage.getItem("users")||"{}");

    users[user] = { name, pass };

    localStorage.setItem("users", JSON.stringify(users));

    alert("Alumno registrado");
}
