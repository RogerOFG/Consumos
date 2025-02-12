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

    return consumo;
}

// Gasto total
async function getTotalSpent() {
    const table = await getTableDaySpent();

    last = table[table.length - 1];

    table.filter(row => row.consumo_total == last.consumo_total);

    // Guardamos y validamos antes de asignar el valor
    const label = document.getElementById('totalSpent');

    let totalSpent = parseFloat(last.consumo_total);

    // Redondeamos a un decimal
    totalSpent = totalSpent.toFixed(1);

    if(label) {
        label.innerHTML = totalSpent;
    }
}

// Gasto desde la última factura
async function getSpentSinceLastBill() {
    const table = await getTableDaySpent();

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

    if(label) {
        label.innerHTML = res;
    }

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

    if(label) {
        label.innerHTML = res;
    }

    console.log("Restante: ", res);
}