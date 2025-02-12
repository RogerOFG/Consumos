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

    return consumo;
}

// Gasto de la última factura
async function getLastBill() {
    const table = await getTableBill();

    last = table[table.length - 1];

    table.filter(row => row.consumo == last.consumo);

    // Guardamos y validamos antes de asignar el valor
    const label = document.getElementById('spentLastBill');

    if(label) label.innerHTML = last.consumo;
}

// Promedio de gasto mensual
async function getAverageMonthlySpent() {
    const table = await getTableBill();

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
