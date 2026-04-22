const API_KEY = "KuN01v9kDmX5Ibh57Taowq7btGd5Hsz7";

const videoIntro = document.getElementById('video-intro');
const infoInicio = document.getElementById('info-inicio');

// ARRANQUE FORZADO DEL VIDEO
if (videoIntro) {
    videoIntro.play().catch(() => {
        // Si el navegador lo bloquea, lo intentamos al primer toque en la pantalla
        document.body.addEventListener('click', () => {
            videoIntro.play();
        }, { once: true });
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
    document.getElementById('pantalla-registro').classList.add('oculto');
    document.getElementById('pantalla-chat').classList.remove('oculto');
}

async function enviarMensaje() {
    const pInput = document.getElementById('pregunta');
    const p = pInput.value.trim();
    if (!p) return;

    const caja = document.getElementById('caja-chat');
    caja.innerHTML += `<div style="text-align:right; margin:10px;">Tú: ${p}</div>`;
    pInput.value = '';

    if (p.toLowerCase().includes("avance")) {
        caja.innerHTML += `<div><strong>Berus:</strong> Generando avance multimedia...<br><button onclick="procesarVideo('a')">Ver Opción A</button> <button onclick="procesarVideo('b')">Ver Opción B</button></div>`;
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
                messages: [{ role: "user", content: p }]
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
    let videoSrc = (op === 'a') ? "7114.mp4" : "7115.mp4";
    caja.innerHTML += `<div><video width="100%" controls><source src="${videoSrc}" type="video/mp4"></video></div>`;
}
