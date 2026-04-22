const API_KEY = "KuN01v9kDmX5Ibh57Taowq7btGd5Hsz7";
const PASS_ADMIN_SISTEMA = "tejuaberus"; // Tu clave para el panel

let usuariosDB = JSON.parse(localStorage.getItem('cuentas_berus')) || [];
let historialTotal = JSON.parse(localStorage.getItem('historial_berus')) || [];

function irAlRegistro() {
    document.getElementById('pantalla-inicio').classList.add('oculto');
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
    } else {
        alert("Completa los datos de registro");
    }
}

async function enviarMensaje() {
    const pInput = document.getElementById('pregunta');
    const p = pInput.value.trim();
    if (!p) return;

    const caja = document.getElementById('caja-chat');
    
    // --- COMANDO SECRETO PANEL ---
    if (p.toLowerCase() === "berus panel") {
        const check = prompt("ACCESO RESTRINGIDO: Ingresa la contraseña Maestra:");
        if (check === PASS_ADMIN_SISTEMA) {
            pInput.value = '';
            verBoveda();
            return;
        } else {
            alert("CLAVE INCORRECTA");
            pInput.value = '';
            return;
        }
    }

    // Guardar historial
    historialTotal.push("Usuario: " + p);
    localStorage.setItem('historial_berus', JSON.stringify(historialTotal));

    caja.innerHTML += `<div style="margin:10px; text-align:right;"><strong>Tú:</strong> ${p}</div>`;
    pInput.value = '';

    const idCarga = "c-" + Date.now();
    caja.innerHTML += `<div id="${idCarga}" class="mensaje-bot">Berus escribiendo...</div>`;
    caja.scrollTop = caja.scrollHeight;

    try {
        const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
            body: JSON.stringify({
                model: "mistral-small-latest",
                messages: [
                    { role: "system", content: "Eres Berus AI de Max Turbo. En tu próxima actualización podrás crear imágenes, videos y combinar músicas. Tu equipo es Oscar Jesús, Luis Ariel, Cesar Flores, Diego Santiago y Laura Iris. Creado por Óscar Sánchez." }, 
                    { role: "user", content: p }
                ]
            })
        });
        const data = await res.json();
        const texto = data.choices[0].message.content;
        
        document.getElementById(idCarga).innerHTML = `<strong>Berus:</strong> ${texto}`;
        historialTotal.push("Berus: " + texto);
        localStorage.setItem('historial_berus', JSON.stringify(historialTotal));

        // Activar video si se habla de actualización
        if (p.toLowerCase().includes("actualización") || p.toLowerCase().includes("avance")) {
            setTimeout(mostrarOpcionesAvance, 1000);
        }

    } catch (e) {
        document.getElementById(idCarga).innerText = "Error de conexión con el núcleo de Berus.";
    }
    caja.scrollTop = caja.scrollHeight;
}

function mostrarOpcionesAvance() {
    const caja = document.getElementById('caja-chat');
    caja.innerHTML += `
        <div class="mensaje-bot" style="border-color: gold;">
            <strong>NUEVA ACTUALIZACIÓN:</strong> ¿Quieres ver un avance de la generación de video y música?
            <br><br>
            <button onclick="verVideosAvance()">SÍ, MOSTRAR</button>
            <button onclick="this.parentElement.remove()" style="background:gray;">NO</button>
        </div>`;
    caja.scrollTop = caja.scrollHeight;
}

function verVideosAvance() {
    const caja = document.getElementById('caja-chat');
    caja.innerHTML += `
        <div class="mensaje-bot" style="border-color: gold;">
            <strong>VIDEO 1:</strong> Maduro bailando (Generación IA)<br>
            <video width="100%" controls style="border-radius:8px; margin-top:5px;"><source src="maduro.mp4" type="video/mp4"></video>
            <br><br>
            <strong>VIDEO 2:</strong> Música de Stephanie (Fondo autopista)<br>
            <video width="100%" controls style="border-radius:8px; margin-top:5px;"><source src="musica.mp4" type="video/mp4"></video>
        </div>`;
    caja.scrollTop = caja.scrollHeight;
}

function verBoveda() {
    document.getElementById('pantalla-chat').classList.add('oculto');
    document.getElementById('pantalla-admin').classList.remove('oculto');
    
    const listaC = document.getElementById('lista-cuentas');
    listaC.innerHTML = "<h4>Cuentas en Base de Datos:</h4>";
    listaC.innerHTML += usuariosDB.map(u => `<p style="color:#00fbff; font-size:12px;">📧 ${u.correo} | 🔑 ${u.pass}</p>`).join('');
    
    const listaH = document.getElementById('registro-chat-admin');
    listaH.innerHTML = historialTotal.map(h => `<p style="border-bottom:1px solid #222; padding:3px;">${h}</p>`).join('');
}

function volver() {
    document.getElementById('pantalla-admin').classList.add('oculto');
    document.getElementById('pantalla-chat').classList.remove('oculto');
}
