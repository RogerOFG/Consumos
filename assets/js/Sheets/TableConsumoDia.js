// Obtiene los datos de la hoja de cálculo Consumo_Diario
async function getTableDaySpent() {
    let response;

    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: ID_TABLE,
            range: 'Consumo_Diario!A2:E',
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
            row[0] && row[1] && row[2] && row[3] && row[4]
        )
        .map(row => ({
            id: row[0],
            id_factura: row[1],
            consumo_total: row[2],
            consumo: row[3],
            fecha: row[4]
        }));

    localStorage.setItem("Consumo_Diario", JSON.stringify(consumo));

    return consumo;
}

// Gasto total
async function getTotalSpent() {
    const table = JSON.parse(localStorage.getItem("Consumo_Diario"));

    last = table[table.length - 1];

    table.filter(row => row.consumo_total == last.consumo_total);

    // Guardamos y validamos antes de asignar el valor
    const label = document.getElementById('totalSpent');

    let totalSpent = parseFloat(last.consumo_total);

    // Redondeamos a un decimal
    totalSpent = totalSpent.toFixed(1);

    if(label) label.innerHTML = totalSpent;
}

// Gasto desde la última factura (ACTUAL)
async function getSpentSinceLastBill() {
    const table = JSON.parse(localStorage.getItem("Consumo_Diario"));

    let ct = table.length;
    let res = 0;

    table.forEach(row => {
        if(row.id_factura == "ACTUAL") {
            res += parseFloat(row.consumo);
        }
    });

    // Redondeamos a un decimal
    res = res.toFixed(1);

    // Guardamos y validamos antes de asignar el valor
    const label = document.getElementById('SpentSinceLastBill');

    if(label) label.innerHTML = res;

    return res;
}

// Restante para completar el promedio
async function getRemainingToCompleteAverage() {
    const average = await getAverageMonthlySpent();
    const accumulated = await getSpentSinceLastBill();

    let res = parseFloat(average) - parseFloat(accumulated);

    // Redondeamos a un decimal
    res = res.toFixed(1);

    // Guardamos y validamos antes de asignar el valor
    const label = document.getElementById('RemainingToAverage');

    if(label) label.innerHTML = res;
}

// Funcion para convertir una cadena "dd/mm/yy - HH:MM" a una fecha
function parseDate(dateStr){
    const [date] = dateStr.split(" - ");
    const [day, month, year] = date.split("/");

    return new Date(
        parseInt(year, 10),
        parseInt(month, 10) - 1,
        parseInt(day, 10),
    );
}

// Dias transcurridos segun el campo id_factura
async function getdaysElapsed(id_bill) {
    let table = localStorage.getItem(1);
    let currentDate = new Date();

    let filteredTable = table.filter(row => row.id_factura === id_bill);
    let ct = filteredTable.length;

    // Validamos la existencia de informacion en la tabla filtrada
    if (ct === 0) return;

    let firstDate = filteredTable[0].fecha;

    const firstDateObject = parseDate(firstDate);
    const lastDateObject = parseDate(filteredTable[ct - 1].fecha);

    const endDateObject = (id_bill === "ACTUAL")
        ? currentDate
        : lastDateObject;

    let daysPast = Math.floor((endDateObject - firstDateObject) / (1000 * 60 * 60 * 24));

    return daysPast;
}

// Promedio de consumo entre dias transcurridos
async function getAverageSpentPerDay(id_bill) {
    let days = await getdaysElapsed(id_bill);
    let spent = await getSpentSinceLastBill();

    let res = parseFloat(spent) / parseFloat(days);

    const label = document.getElementById('AverageSpentPerDay');

    // Redondeamos a un decimal y retornamos
    res = res.toFixed(1);

    if (label) label.innerHTML = res;

    return res;
}

// Funcion para validar si ya se registro el consumo del dia
async function validateRecordOfTheDay() {
    const table = JSON.parse(localStorage.getItem("Consumo_Diario"));
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const lastSpentDate = table[table.length - 1].fecha;

    var dateObject = parseDate(lastSpentDate);

    let daysPast = Math.floor((currentDate - dateObject) / (1000 * 60 * 60 * 24));

    const btnReg = document.getElementById('btnRegister');
    const btnUpd = document.getElementById('btnUpdate');

    const boxW = document.getElementById('boxWaitingSpent');
    const boxS = document.getElementById('boxSpent');
    const message = document.getElementById('boxMessage');

    if (!btnReg && !btnUpd) return;

    const isToday = daysPast === 0;

    btnReg.classList.toggle('hidde', isToday);      // Si es hoy, se oculta btnReg
    btnUpd.classList.toggle('hidde', !isToday);      // Si es hoy, se muestra btnUpd

    boxW.classList.toggle('hidde', isToday);         // Si es hoy, se oculta boxW
    boxS.classList.toggle('hidde', !isToday);         // Si es hoy, se muestra boxS

    message.innerHTML = isToday
        ? "Gasto del día registrado"
        : "Aun no se han registrado gastos el día de hoy";
}