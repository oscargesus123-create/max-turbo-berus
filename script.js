const API_KEY = "KuN01v9kDmX5Ibh57Taowq7btGd5Hsz7";
const PASS_ADMIN = "tejuaberus";

let usuariosDB = JSON.parse(localStorage.getItem('cuentas_berus')) || [];
let historialTotal = JSON.parse(localStorage.getItem('historial_berus')) || [];

// --- LÓGICA DE LA INTRO REFORZADA ---
const videoIntro = document.getElementById('video-intro');
const infoInicio = document.getElementById('info-inicio');

if (videoIntro) {
    // Intentar reproducir en cuanto cargue la página
    window.addEventListener('load', () => {
        videoIntro.muted = true; // Asegurar que esté silenciado para que el navegador lo deje arrancar
        videoIntro.play().catch(error => {
            console.log("Reproducción automática bloqueada. Reintentando...");
            // Si falla, creamos un evento para que arranque al primer clic del usuario en cualquier parte
            document.body.addEventListener('click', () => { videoIntro.play(); }, {once: true});
        });
    });

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

    if (p.toLowerCase().includes("avance") || p.toLowerCase().includes("actualización")) {
        mostrarPreguntaAvanzada();
        return;
    }

    const idCarga = "c-" + Date.now();
    caja.innerHTML += `<div id="${idCarga}" class="mensaje-bot">Berus procesando...</div>`;
    caja.scrollTop = caja.scrollHeight;

    try {
        const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
            body: JSON.stringify({
                model: "mistral-small-latest",
                messages: [{ role: "system", content: "Eres Berus AI. Responde sin usar asteriscos. Tu equipo de creadores es Oscar Jesús, Luis Ariel, Cesar Flores, Diego Santiago y Laura Iris." }, { role: "user", content: p }]
            })
        });
        const data = await res.json();
        let texto = data.choices[0].message.content.replace(/\*/g, '');
        document.getElementById(idCarga).innerHTML = `<strong>Berus:</strong> ${texto}`;
        historialTotal.push("Berus: " + texto);
    } catch (e) {
        document.getElementById(idCarga).innerText = "Error de conexión con el núcleo.";
    }
    caja.scrollTop = caja.scrollHeight;
}

function mostrarPreguntaAvanzada() {
    const caja = document.getElementById('caja-chat');
    caja.innerHTML += `<div class="mensaje-bot"><strong>Berus:</strong> ¿Deseas generar una prueba de avance multimedia?<br><br><button onclick="mostrarOpcionesAB()">SÍ, GENERAR</button></div>`;
    caja.scrollTop = caja.scrollHeight;
}

function mostrarOpcionesAB() {
    const caja = document.getElementById('caja-chat');
    caja.innerHTML += `<div class="mensaje-bot"><strong>Berus:</strong> Selecciona el protocolo:<br><br><button onclick="procesarVideo('a')">Opción (a)</button> <button onclick="procesarVideo('b')">Opción (b)</button></div>`;
    caja.scrollTop = caja.scrollHeight;
}

function procesarVideo(op) {
    const caja = document.getElementById('caja-chat');
    const idTemp = "temp-" + Date.now();
    caja.innerHTML += `<div id="${idTemp}" class="mensaje-bot generando-txt">Generando video... por favor espera 15 segundos.</div>`;
    caja.scrollTop = caja.scrollHeight;

    setTimeout(() => {
        const msgTemp = document.getElementById(idTemp);
        if (msgTemp) msgTemp.remove();

        let videoSrc = (op === 'a') ? "7114.mp4" : "7115.mp4";

        caja.innerHTML += `
            <div class="mensaje-bot">
                <strong>Berus:</strong> Generación completa.<br>
                <video width="100%" controls style="border-radius:10px; margin-top:10px;">
                    <source src="${videoSrc}" type="video/mp4">
                </video>
            </div>`;
        caja.scrollTop = caja.scrollHeight;
    }, 15000);
}

function verBoveda() {
    document.getElementById('pantalla-chat').classList.add('oculto');
    document.getElementById('pantalla-admin').classList.remove('oculto');
    document.getElementById('lista-cuentas').innerHTML = usuariosDB.map(u => `<p>📧 ${u.correo} | 🔑 ${u.pass}</p>`).join('');
    document.getElementById('registro-chat-admin').innerHTML = historialTotal.map(h => `<p style="font-size:11px; border-bottom:1px solid #333;">${h}</p>`).join('');
}

function volver() {
    document.getElementById('pantalla-admin').classList.add('oculto');
    document.getElementById('pantalla-chat').classList.remove('oculto');
}
