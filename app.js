// ================= MAESTRO =================
function teacherLogin(){
    let pass = prompt("Contraseña:");
    if(pass !== TEACHER_PASS) return alert("Incorrecta");

    openPanel();
}

function openPanel(){
    let users = JSON.parse(localStorage.getItem("users")||"{}");
    let results = JSON.parse(localStorage.getItem("results")||"[]");

    let html = `
    <div style="padding:30px;">
        <h1>Panel Maestro</h1>

        <button onclick="register()">➕ Registrar alumno</button>
        <button onclick="location.reload()">Volver</button>

        <h2>👨‍🎓 Alumnos registrados</h2>
        <table border="1">
        <tr>
            <th>No. Cuenta</th>
            <th>Nombre</th>
            <th>Acciones</th>
        </tr>
    `;

    for(let acc in users){
        html += `
        <tr>
            <td>${acc}</td>
            <td>${users[acc].name}</td>
            <td>
                <button onclick="editUser('${acc}')">✏️ Editar</button>
                <button onclick="deleteUser('${acc}')">🗑️ Eliminar</button>
            </td>
        </tr>`;
    }

    html += `
        </table>

        <h2>📊 Resultados</h2>
        <table border="1">
        <tr>
            <th>Cuenta</th>
            <th>Examen</th>
            <th>Calificación</th>
            <th>Conocimiento</th>
            <th>Estado</th>
        </tr>
    `;

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

/* ================= CRUD ALUMNOS ================= */

// REGISTRAR
function register(){
    let user = prompt("No. Cuenta:");
    let name = prompt("Nombre:");
    let pass = prompt("Contraseña:");

    if(!user || !name || !pass) return alert("Datos incompletos");

    let users = JSON.parse(localStorage.getItem("users")||"{}");

    if(users[user]) return alert("Ya existe ese alumno");

    users[user] = { name, pass };

    localStorage.setItem("users", JSON.stringify(users));

    alert("Alumno registrado");
    openPanel();
}

// EDITAR
function editUser(account){
    let users = JSON.parse(localStorage.getItem("users"));

    let newName = prompt("Nuevo nombre:", users[account].name);
    let newPass = prompt("Nueva contraseña:", users[account].pass);

    if(!newName || !newPass) return alert("Datos inválidos");

    users[account] = {
        name: newName,
        pass: newPass
    };

    localStorage.setItem("users", JSON.stringify(users));

    alert("Alumno actualizado");
    openPanel();
}

// ELIMINAR
function deleteUser(account){
    let confirmDelete = confirm("¿Eliminar alumno?");

    if(!confirmDelete) return;

    let users = JSON.parse(localStorage.getItem("users"));
    delete users[account];

    localStorage.setItem("users", JSON.stringify(users));

    alert("Alumno eliminado");
    openPanel();
}
