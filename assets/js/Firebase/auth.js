// form.js
import { db, auth, provider, signInWithPopup, signOut } from "./firebaseconect.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

const iconLogin = document.getElementById('iconAuth');
const footer = document.getElementById('Footer');

// Lista de correos autorizados
const correosPermitidos = [
    "gamesalpha1@gmail.com"
];

// Verificar el estado de autenticación al cargar la página
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuario autenticado
        // Aquí puedes verificar si el correo está permitido
        if (correosPermitidos.includes(user.email)) {
            loginBtn.classList.add('hidde');
            logoutBtn.classList.remove('hidde');
            iconLogin.innerHTML = "🙉";
            footer.classList.remove('hidde');
        } else {
            alert("Acceso denegado: Este correo no está autorizado.");
            logout(); // Cerrar sesión si el correo no es permitido 
        }
    } else {
        // No hay usuario autenticado
        loginBtn.classList.remove('hidde');
        logoutBtn.classList.add('hidde');
        iconLogin.innerHTML = "🙈";

        if (location.href !== window.location.origin + "/") window.location.href = "/";
    }
});

// Función para iniciar sesión con Google
async function login() {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        if (correosPermitidos.includes(user.email)) {
            console.log(`Bienvenido, ${user.displayName} (${user.email})`);

            loginBtn.classList.add('hidde');
            logoutBtn.classList.remove('hidde');
            iconLogin.innerHTML = "🙉";
            footer.classList.remove('hidde');
        } else {
            alert("Acceso denegado: Este correo no está autorizado.");
            await logout();
        }
    } catch (error) {
        console.error("Error al iniciar sesión", error);
    }
}

// Función para cerrar sesión
async function logout() {
    try {
        await signOut(auth);
        loginBtn.classList.remove('hidde');
        logoutBtn.classList.add('hidde');

        location.href ="/";
    } catch (error) {
        console.error("Error al cerrar sesión", error);
    }
}

// Event Listeners
loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);

// Función para transformar array de tablas en Colecciones y documentos (firebase)
async function TransformArrayInTables(i, sw) {
    if (arrayData[i]) {
        console.log("-> ", arrayData.length - 1);
        console.log(i);

        const docRef = doc(db, arrayData[i].tabla, arrayData[i].ID);

        // Verificamos si el documento (ID) ya existe en la base de datos
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) { // Si no existe, lo agregamos
            const data = {
                consumo: arrayData[i].consumo
            };

            if (arrayData[i].tabla == "Consumo_Diario") {
                data.id_factura = arrayData[i].id_factura;
                data.consumo_total = arrayData[i].consumo_total;
                data.fecha = arrayData[i].fecha;
            }else if (arrayData[i].tabla == "TableFacturas") {
                data.fecha = arrayData[i].fecha;
            }

            await setDoc(docRef, data);
        } else {
            console.log(`Documento ${arrayData[i].ID} ya existe. No se agregó.`);
        }

        TransformArrayInTables(i+1, sw);
    }else{
        sw = true;
    }
}

//! CUIDADO: Solo descomentar para iniciar el proceso de guardado de las tablas
// TransformArrayInTables(0, false);