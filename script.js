const API_KEY = "KuN01v9kDmX5Ibh57Taowq7btGd5Hsz7";
const PASS_ADMIN = "tejuaberus";

let usuariosDB = JSON.parse(localStorage.getItem('cuentas_berus')) || [];
let historialTotal = JSON.parse(localStorage.getItem('historial_berus')) || [];

// --- REPARADOR DE INTRO ---
const videoIntro = document.getElementById('video-intro');
const infoInicio = document.getElementById('info-inicio');

if (videoIntro) {
    videoIntro.load();
    let forzarPlay = setInterval(() => {
        videoIntro.play().then(() => {
            clearInterval(forzarPlay);
        }).catch(e => console.log("Cargando sistema..."));
    }, 500);

    videoIntro.onended = () => {
        infoInicio.classList.remove('oculto-fade');
        infoInicio.classList.add('visible-fade');
    };
}

function irAlRegistro() {
    document.getElementById('contenedor-principal').classList.add('oculto');
    document.getElementById('pantalla-registro').classList.remove('oculto');
}

function registrar() {
    const correo = document.getElementById('correo').value;
    const pass = document.getElementById('pass').value;
    if (correo && pass) {
        usuariosDB.push({ correo, pass });
        localStorage.setItem('cuentas_berus', JSON.stringify(usuariosDB));
        document.getElementById('pantalla-registro').classList.add('oculto');
        document.getElementById('pantalla-chat').classList.remove('oculto');
    }
}

async function enviarMensaje() {
    const pInput = document.getElementById('pregunta');
    const p = pInput.value.trim();
    if (!p) return;

    const caja = document.getElementById('caja-chat');
    
    if (p.toLowerCase() === "berus panel") {
        const check = prompt("Acceso Administrador:");
        if (check === PASS_ADMIN) { verBoveda(); pInput.value = ''; return; }
    }

    caja.innerHTML += `<div style="text-align:right; margin:10px;">Tú: ${p}</div>`;
    historialTotal.push("Usuario: " + p);
    localStorage.setItem('historial_berus', JSON.stringify(historialTotal));
    pInput.value = '';

    if (p.toLowerCase().includes("avance")) {
        mostrarPreguntaAvanzada();
        return;
    }

    const idCarga = "c-" + Date.now();
    caja.innerHTML += `<div id="${idCarga}">Berus procesando...</div>`;
    caja.scrollTop = caja.scrollHeight;

    try {
        const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
            body: JSON.stringify({
                model: "mistral-small-latest",
                messages: [{ role: "system", content: "Eres Berus AI. Equipo: Oscar Jesús, Luis Ariel, Cesar Flores, Diego Santiago y Laura Iris." }, { role: "user", content: p }]
            })
        });
        const data = await res.json();
        document.getElementById(idCarga).innerHTML = `<strong>Berus:</strong> ${data.choices[0].message.content}`;
    } catch (e) {
        document.getElementById(idCarga).innerText = "Error de conexión.";
    }
    caja.scrollTop = caja.scrollHeight;
}

function mostrarPreguntaAvanzada() {
    const caja = document.getElementById('caja-chat');
    caja.innerHTML += `<div><strong>Berus:</strong> ¿Generar avance?<br><br><button onclick="mostrarOpcionesAB()">SÍ, GENERAR</button></div>`;
    caja.scrollTop = caja.scrollHeight;
}

function mostrarOpcionesAB() {
    const caja = document.getElementById('caja-chat');
    caja.innerHTML += `<div><button onclick="procesarVideo('a')">Opción (a)</button> <button onclick="procesarVideo('b')">Opción (b)</button></div>`;
    caja.scrollTop = caja.scrollHeight;
}

function procesarVideo(op) {
    const caja = document.getElementById('caja-chat');
    const idTemp = "temp-" + Date.now();
    caja.innerHTML += `<div id="${idTemp}" class="generando-txt">Generando video... espera 15s.</div>`;
    
    setTimeout(() => {
        document.getElementById(idTemp).remove();
        let videoSrc = (op === 'a') ? "7114.mp4" : "7115.mp4";
        caja.innerHTML += `<div><strong>Berus:</strong> Generado:<br><video width="100%" controls style="border-radius:10px;"><source src="./${videoSrc}" type="video/mp4"></video></div>`;
        caja.scrollTop = caja.scrollHeight;
    }, 15000);
}

function verBoveda() {
    document.getElementById('pantalla-chat').classList.add('oculto');
    document.getElementById('pantalla-admin').classList.remove('oculto');
    document.getElementById('lista-cuentas').innerHTML = usuariosDB.map(u => `<p>📧 ${u.correo} | 🔑 ${u.pass}</p>`).join('');
    document.getElementById('registro-chat-admin').innerHTML = historialTotal.map(h => `<p>${h}</p>`).join('');
}

function volver() {
    document.getElementById('pantalla-admin').classList.add('oculto');
    document.getElementById('pantalla-chat').classList.remove('oculto');
}
