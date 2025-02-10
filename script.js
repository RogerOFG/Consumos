// URL de la API de Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbxmdvZu7kxlx1NA277uAOTX1H9bcxwUlk4tWxDgW5rpbKgRGX1j6VQDscHJP5k4ykD5/exec";

// Función para enviar datos a Google Sheets
function enviarConsumo() {
    let fecha = new Date().toISOString().split("T")[0]; // Fecha en formato YYYY-MM-DD
    let consumo = document.getElementById("inputConsumo").value;

    if (!consumo) {
        alert("Por favor, ingrese un valor de consumo.");
        return;
    }

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha, consumo }) // Enviar fecha y consumo como JSON
    })
        .then(response => response.text())
        .then(data => {
            alert("Consumo guardado correctamente.");
            obtenerConsumo(); // Recargar los datos después de guardar
        })
        .catch(error => console.error("Error al guardar:", error));
}

// Función para obtener datos desde Google Sheets
function obtenerConsumo() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            let tabla = document.getElementById("tablaConsumo");
            tabla.innerHTML = ""; // Limpiar la tabla antes de actualizar

            data.forEach((fila, index) => {
                if (index === 0) return; // Saltar la primera fila (encabezados)

                let filaHTML = `<tr>
                                    <td>${fila[0]}</td>
                                    <td>${fila[1]}</td>
                                </tr>`;
                tabla.innerHTML += filaHTML;
            });
        })
        .catch(error => console.error("Error al obtener datos:", error));
}

// Llamar a la función para obtener datos cuando la página cargue
document.addEventListener("DOMContentLoaded", obtenerConsumo);
