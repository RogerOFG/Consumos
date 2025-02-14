// Obtiene los datos de la hoja de cálculo Factura
async function getTableBill() {
    let response;

    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: ID_TABLE,
            range: 'Factura!A2:C',
        });
    } catch (err) {
        console.error('Error al obtener datos:', err);
        return [];
    }

    const table = response.result;

    if (!table || !table.values || table.values.length == 0) {
        console.warn("No se encontraron valores.");
        return [];
    }

    consumo = table.values
        .filter(row =>
            row[0] && row[1] && row[2]
        )
        .map(row => ({
            id: row[0],
            consumo: row[1],
            fecha: row[2]
        }));

    localStorage.setItem("Factura", JSON.stringify(consumo));

    return consumo;
}

// Gasto de la última factura
async function getLastBill() {
    const table = JSON.parse(localStorage.getItem("Factura"));

    last = table[table.length - 1];

    table.filter(row => row.consumo == last.consumo);

    // Guardamos y validamos antes de asignar el valor
    const label = document.getElementById('spentLastBill');

    if(label) label.innerHTML = last.consumo;
}

// Promedio de gasto mensual
async function getAverageMonthlySpent() {
    const table = JSON.parse(localStorage.getItem("Factura"));

    let ct = table.length;
    let total = 0;

    table.forEach(row => {
        total += parseFloat(row.consumo);
    });

    total = total / ct;

    // Redondeamos a un decimal
    total = total.toFixed(1);

    // Guardamos y validamos antes de asignar el valor
    const label = document.getElementById('AverageMonthlySpent');

    if(label) label.innerHTML = total;

    return total;
}

// Creacion de elementos HTML
function createElementsHTML(value, className, father) {
    var newInput = document.createElement("input");
    newInput.type = "hidden";
    newInput.value = value;
    newInput.className = className;

    document.getElementById(father).appendChild(newInput);
}

// Funcion para modificar una fecha con formato: "12 Febrero 25" 
function formatDate(dateStr){
    const [date] = dateStr.split(" - ");
    const [day, month, year] = date.split("/");
    const monthAbbr = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const formattedYear = year.slice(-2);

    return `${day} ${monthAbbr[parseInt(month, 10) - 1]} ${formattedYear}`;
}

// Imprimir las facturas de los ultimos 6 meses
async function getBillsFromLast6Months() {
    const table = JSON.parse(localStorage.getItem("Factura"));
    let ct = table.length;

    const bills = ct > 6 ? table.slice(ct - 6) : table;

    bills.forEach(bill => {
        const newDateFormat = formatDate(bill.fecha);

        createElementsHTML(bill.consumo, "data-input", "dataGrafic");
        createElementsHTML(newDateFormat, "date-input", "dataGrafic");
    });
}