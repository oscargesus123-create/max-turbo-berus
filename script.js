const API_KEY = "KuN01v9kDmX5Ibh57Taowq7btGd5Hsz7";

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
    caja.innerHTML += `<div class="mensaje-user">Tú: ${p}</div>`;
    pInput.value = '';

    // Lógica para activar las opciones de video
    if (p.toLowerCase().includes("avance") || p.toLowerCase().includes("video")) {
        caja.innerHTML += `
            <div class="mensaje-bot">
                <strong>Berus:</strong> Módulo multimedia detectado. ¿Qué avance deseas visualizar?<br><br>
                <button onclick="procesarVideo('a')">Opción A</button> 
                <button onclick="procesarVideo('b')">Opción B</button>
            </div>`;
        caja.scrollTop = caja.scrollHeight;
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
                messages: [
                    { role: "system", content: "Eres Berus AI. Tu equipo: Oscar Jesús, Luis Ariel, Cesar Flores, Diego Santiago y Laura Iris." },
                    { role: "user", content: p }
                ]
            })
        });
        const data = await res.json();
        document.getElementById(idCarga).innerHTML = `<strong>Berus:</strong> ${data.choices[0].message.content}`;
    } catch (e) {
        document.getElementById(idCarga).innerText = "Error de conexión con el núcleo.";
    }
    caja.scrollTop = caja.scrollHeight;
}

function procesarVideo(op) {
    const caja = document.getElementById('caja-chat');
    const idTemp = "temp-" + Date.now();
    caja.innerHTML += `<div id="${idTemp}" class="mensaje-bot generando-txt">Cargando video... por favor espera 15 segundos.</div>`;
    caja.scrollTop = caja.scrollHeight;

    setTimeout(() => {
        const msgTemp = document.getElementById(idTemp);
        if (msgTemp) msgTemp.remove();

        let videoSrc = (op === 'a') ? "7114.mp4" : "7115.mp4";
        let titulo = (op === 'a') ? "Avance Protocolo A" : "Avance Protocolo B";

        caja.innerHTML += `
            <div class="mensaje-bot">
                <strong>Berus:</strong> ${titulo} cargado con éxito.<br>
                <video width="100%" controls style="border-radius:10px; margin-top:10px;">
                    <source src="${videoSrc}" type="video/mp4">
                </video>
            </div>`;
        caja.scrollTop = caja.scrollHeight;
    }, 15000);
}
