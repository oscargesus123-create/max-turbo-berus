const API_KEY = "KuN01v9kDmX5Ibh57Taowq7btGd5Hsz7";
const PASS_ADMIN = "tejuaberus";

let usuariosDB = JSON.parse(localStorage.getItem('cuentas_berus')) || [];
let historialTotal = JSON.parse(localStorage.getItem('historial_berus')) || [];

// ESCUCHAR TECLAS (ENTER y F)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (!document.getElementById('pantalla-registro').classList.contains('oculto')) registrar();
        else if (!document.getElementById('pantalla-chat').classList.contains('oculto')) enviarMensaje();
    }
    
    // Tecla F para Pantalla Completa del video
    if (e.key.toLowerCase() === 'f') {
        const videos = document.getElementsByTagName('video');
        if (videos.length > 0) {
            const ultimoVideo = videos[videos.length - 1];
            if (!document.fullscreenElement) {
                ultimoVideo.requestFullscreen().catch(err => console.log(err));
            } else {
                document.exitFullscreen();
            }
        }
    }
});

function irAlRegistro() {
    document.getElementById('contenedor-principal').classList.add('oculto');
    document.getElementById('pantalla-registro').classList.remove('oculto');
}

function registrar() {
    const correo = document.getElementById('correo').value.trim();
    const pass = document.getElementById('pass').value.trim();
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

    caja.innerHTML += `<div class="mensaje-user">Tú: ${p}</div>`;
    historialTotal.push("Usuario: " + p);
    pInput.value = '';

    if (p.toLowerCase().includes("avance") || p.toLowerCase().includes("actualización")) {
        mostrarOpcionesMultimedia();
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
                messages: [{ role: "system", content: "Eres Berus AI, creado por Oscar Neymar. Eres profesional y directo." }, { role: "user", content: p }]
            })
        });
        const data = await res.json();
        let texto = data.choices[0].message.content.replace(/\*/g, '');
        document.getElementById(idCarga).innerHTML = `<strong>Berus:</strong> ${texto}`;
        historialTotal.push("Berus: " + texto);
    } catch (e) {
        document.getElementById(idCarga).innerText = "Error de conexión.";
    }
    caja.scrollTop = caja.scrollHeight;
}

function mostrarOpcionesMultimedia() {
    const caja = document.getElementById('caja-chat');
    caja.innerHTML += `
        <div class="mensaje-bot">
            <strong>Berus:</strong> Protocolos multimedia detectados. Selecciona una opción para renderizar:<br><br>
            <strong>Protocolo (A):</strong> Maduro bailando como King Nasir.<br>
            <button onclick="procesarVideo('a')">EJECUTAR (A)</button><br><br>
            <strong>Protocolo (B):</strong> Visuales Stephanie - Autopista Ciudad.<br>
            <button onclick="procesarVideo('b')">EJECUTAR (B)</button>
        </div>`;
    caja.scrollTop = caja.scrollHeight;
}

function procesarVideo(op) {
    const caja = document.getElementById('caja-chat');
    const idTemp = "temp-" + Date.now();
    caja.innerHTML += `<div id="${idTemp}" class="mensaje-bot generando-txt">Oscar Neymar está procesando el video... espera 15s.</div>`;
    caja.scrollTop = caja.scrollHeight;

    setTimeout(() => {
        if (document.getElementById(idTemp)) document.getElementById(idTemp).remove();
        let videoSrc = (op === 'a') ? "7114.mp4" : "7115.mp4";
        caja.innerHTML += `
            <div class="mensaje-bot">
                <strong>Berus:</strong> Renderizado finalizado. (Toca el video y presiona 'F' para pantalla completa).<br>
                <video class="video-avance" controls>
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
