import { db } from "./firebaseconect.js";
import { collection, doc, addDoc, getDocs, setDoc, query, where } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

//* Función para mostrar los datos almacenados en Firebase de la Coleccion "TableFacturas"
async function getTableBills() {
    try {
        const querySnapshot = await getDocs(collection(db, "TableFacturas"));

        return querySnapshot;
    } catch (error) {
        console.error("Error al obtener datos", error);
    }
}

async function getTotalSpent() {
    const table = await getTableBills();

    table.docs.forEach(doc => {
        // doc.data() contiene los datos del documento
        console.log("ID:", doc.consumo);
    });
}

getTotalSpent();

// //* Funciona para guardar
// async function insert() {
//     let data = await mostrarDatos();
//     data = data.size + 1;

//     const date = "6/03/2025 - 0:00:00";

//     const customID = `${data}`;
//     const docRef = doc(db, "TableFacturas", customID);

//     await setDoc(docRef, {
//         consumo: "133",
//         fecha: date
//     });
// }

// //* Filtrar
// async function filterQuery() {
//     try {
//         let customID = "a";
//         const filterQuery = query(collection(db, "TableFacturas"), where("consumo", "==", "121"));
//         const querySnapshot = await getDocs(filterQuery);

//         querySnapshot.forEach((doc) => {
//             const spent = doc.data().consumo;
//             const date = doc.data().fecha;

//             statTotalSpent.innerHTML += spent;
//         });
//     } catch (error) {
//         console.error("Error al obtener datos", error);
//     }
// }

// //* Función para guardar la firma en Firebase
// async function guardarFirma(event) {
//     event.preventDefault();

//     const firma = inputFirma.value.trim();
//     if (!firma) return alert("El campo no puede estar vacío");

//     try {
//         await addDoc(collection(db, "Firma"), { ID: 1, Usuarios: firma });
//         console.log("Firma guardada correctamente");
//         inputFirma.value = "";

//         mostrarDatos();
//     } catch (error) {
//         console.error("Error al agregar datos", error);
//     }
// }

// //* Event Listener para el formulario
// formulario.addEventListener("submit", guardarFirma);

// //* Cargar datos al iniciar
// document.addEventListener("DOMContentLoaded", mostrarDatos);