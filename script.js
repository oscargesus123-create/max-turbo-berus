const API_KEY = "KuN01v9kDmX5Ibh57Taowq7btGd5Hsz7";

const videoIntro = document.getElementById('video-intro');
const infoInicio = document.getElementById('info-inicio');

// --- ACTIVADOR DE INTRO ---
if (videoIntro) {
    videoIntro.load();
    
    // Intenta darle "Play" automáticamente
    let playInterval = setInterval(() => {
        videoIntro.play().then(() => {
            clearInterval(playInterval);
        }).catch(() => {
            console.log("Esperando carga de video...");
        });
    }, 500);

    // Si el video termina, muestra el mensaje
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
        document.getElementById('pantalla-registro').classList.add('oculto');
        document.getElementById('pantalla-chat').classList.remove('oculto');
    }
}

async function enviarMensaje() {
    const pInput = document.getElementById('pregunta');
    const p = pInput.value.trim();
    if (!p) return;

    const caja = document.getElementById('caja-chat');
    caja.innerHTML += `<div style="text-align:right; margin:10px;">Tú: ${p}</div>`;
    pInput.value = '';

    if (p.toLowerCase().includes("avance")) {
        caja.innerHTML += `<div><strong>Berus:</strong> ¿Generar prueba multimedia?<br><button onclick="procesarVideo('a')">Opción A</button> <button onclick="procesarVideo('b')">Opción B</button></div>`;
        return;
    }

    const idCarga = "c-" + Date.now();
    caja.innerHTML += `<div id="${idCarga}">Berus procesando...</div>`;
    
    try {
        const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
            body: JSON.stringify({
                model: "mistral-small-latest",
                messages: [{ role: "system", content: "Eres Berus AI. Creado por Oscar Jesús y su equipo." }, { role: "user", content: p }]
            })
        });
        const data = await res.json();
        document.getElementById(idCarga).innerHTML = `<strong>Berus:</strong> ${data.choices[0].message.content}`;
    } catch (e) {
        document.getElementById(idCarga).innerText = "Error de red.";
    }
}

function procesarVideo(op) {
    const caja = document.getElementById('caja-chat');
    const idTemp = "temp-" + Date.now();
    caja.innerHTML += `<div id="${idTemp}">Generando (15s)...</div>`;
    
    setTimeout(() => {
        document.getElementById(idTemp).remove();
        let videoSrc = (op === 'a') ? "7114.mp4" : "7115.mp4";
        caja.innerHTML += `<div><strong>Berus:</strong> Listo:<br><video width="100%" controls><source src="${videoSrc}" type="video/mp4"></video></div>`;
    }, 15000);
}
