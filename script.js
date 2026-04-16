// 1. CONFIGURACIÓN DE IDENTIDAD Y LLAVE
const API_KEY = "KuN01v9kDmX5Ibh57Taowq7btGd5Hsz7";

let usuariosDB = JSON.parse(localStorage.getItem('cuentas_berus')) || [];

// --- FUNCIONES DE ACCESO Y REGISTRO ---
function verificarCodigo() {
    const cod = document.getElementById('input-codigo').value;
    if (cod === 'tejuaberus') {
        document.getElementById('pantalla-bloqueo').classList.add('oculto');
        document.getElementById('pantalla-registro').classList.remove('oculto');
    } else {
        alert('CÓDIGO INCORRECTO');
    }
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
        alert('Completa los campos de registro');
    }
}

// --- FUNCIÓN DEL CHAT CON INTELIGENCIA ---
async function enviarMensaje() {
    const pInput = document.getElementById('pregunta');
    const p = pInput.value;
    const caja = document.getElementById('caja-chat');
    
    if (p) {
        // Mostrar mensaje del usuario
        caja.innerHTML += `<div class="mensaje-usuario"><strong>Tú:</strong><br>${p}</div>`;
        pInput.value = '';

        // Indicador de que Berus está pensando
        const idCarga = "carga-" + Date.now();
        caja.innerHTML += `<div id="${idCarga}" class="mensaje-bot"><strong>IA Berus:</strong><br>Analizando petición...</div>`;
        caja.scrollTop = caja.scrollHeight;

        try {
            const respuesta = await fetch("https://api.mistral.ai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "mistral-small-latest", 
                    messages: [
                        { 
                            role: "system", 
                            content: "Eres Berus, la IA oficial de la empresa Max Turbo. REGLAS DE RESPUESTA: 1. Si te preguntan quién te creó, di que fue Óscar Neymar Pele Ugo Sanchez. 2. Si preguntan nombres del equipo o quiénes trabajan contigo, menciona a: Oscar Jesús Guerrero Sanchez, Luis Ariel Martines Alonzo, Cesar Flores Meza, Diego Santiago Salazar Vargas y Laura Iris. 3. Escribe de forma limpia, SIN asteriscos, con párrafos claros y profesionales." 
                        },
                        { role: "user", content: p }
                    ]
                })
            });

            const data = await respuesta.json();
            let textoIA = data.choices[0].message.content;

            // Limpieza de texto (Quitar asteriscos y poner saltos de línea)
            textoIA = textoIA.replace(/\*/g, ''); 
            const textoLimpio = textoIA.split('\n').join('<br>');

            // Mostrar respuesta final
            document.getElementById(idCarga).innerHTML = `<strong>IA Berus:</strong><br><div style="margin-top:8px;">${textoLimpio}</div>`;

        } catch (error) {
            document.getElementById(idCarga).innerHTML = `<strong>Error:</strong> Berus no puede responder en este momento.`;
        }
        caja.scrollTop = caja.scrollHeight;
    }
}

// --- FUNCIONES DE ADMINISTRACIÓN ---
function verCuentas() {
    document.getElementById('pantalla-registro').classList.add('oculto');
    document.getElementById('pantalla-admin').classList.remove('oculto');
    const lista = document.getElementById('lista-cuentas');
    lista.innerHTML = ''; 
    usuariosDB.forEach(u => {
        lista.innerHTML += `<p style="padding:10px; border-bottom:1px solid #333; color:#58a6ff;">📧 ${u.correo} | 🔑 ${u.pass}</p>`;
    });
}

function volver() {
    document.getElementById('pantalla-admin').classList.add('oculto');
    document.getElementById('pantalla-registro').classList.remove('oculto');
}