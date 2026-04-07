const TEACHER_PASS = "9907";

let currentExam = examen1;
let answers = [];
let cheating = false;

/* ================= REGISTRO ================= */
function register(){
    let user = prompt("No. Cuenta:");
    let name = prompt("Nombre:");
    let pass = prompt("Contraseña:");

    if(!user || !name || !pass) return alert("Datos incompletos");

    let users = JSON.parse(localStorage.getItem("users")||"{}");

    users[user] = { name, pass };

    localStorage.setItem("users", JSON.stringify(users));

    alert("Alumno registrado");
}

/* ================= LOGIN ================= */
function login(){
    let user = document.getElementById("user").value;
    let pass = document.getElementById("pass").value;

    let users = JSON.parse(localStorage.getItem("users")||"{}");

    if(!users[user] || users[user].pass !== pass){
        alert("Datos incorrectos");
        return;
    }

    localStorage.setItem("currentUser", user);

    showExamStart();
}

/* ================= INICIO EXAMEN ================= */
function showExamStart(){
    document.body.innerHTML = `
    <div class="center">
        <h1>${currentExam.title}</h1>
        <button onclick="startExam()">Iniciar examen</button>
    </div>`;
}

/* ================= EXAMEN ================= */
function startExam(){

    document.addEventListener("visibilitychange", ()=>{
        if(document.hidden){
            cheating = true;
            finishExam();
        }
    });

    let html = `<div style="padding:30px;">`;

    currentExam.questions.forEach((q,i)=>{
        html += `<p><b>${i+1}. ${q.q}</b></p>`;

        q.o.forEach((opt,j)=>{
            html += `<button onclick="answer(${i},${j})">${opt}</button>`;
        });
    });

    html += `<br><button onclick="finishExam()">Finalizar</button></div>`;

    document.body.innerHTML = html;
}

function answer(i,j){
    answers[i] = j;
}

/* ================= FINAL ================= */
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

/* ================= PANEL ================= */
function teacherLogin(){
    let pass = prompt("Contraseña:");
    if(pass !== TEACHER_PASS) return alert("Incorrecta");

    openPanel();
}

function openPanel(){
    let users = JSON.parse(localStorage.getItem("users")||"{}");
    let results = JSON.parse(localStorage.getItem("results")||"[]");

    let html = `<div style="padding:30px;">
    <h1>Panel Maestro</h1>
    <button onclick="location.reload()">Volver</button>

    <h2>Alumnos</h2>`;

    for(let u in users){
        html += `<p>${u} - ${users[u].name}</p>`;
    }

    html += `<h2>Resultados</h2>
    <table border="1">
    <tr>
        <th>Cuenta</th>
        <th>Examen</th>
        <th>Calificación</th>
        <th>Conocimiento</th>
        <th>Estado</th>
    </tr>`;

    results.forEach(r=>{
        html += `<tr>
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
