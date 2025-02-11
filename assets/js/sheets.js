let consumo;

async function searchRow(id) {
    let response;
    let row = parseInt(id) + 1;

    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: ID_TABLE,
            range: `Consumo_Diario!A${row}:E`,
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

    return table.values[0];
}

async function getTableConsumoDia() {
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

        mostrarConsumosEnTabla(consumo);

        const ct = consumo.length;
        document.getElementById('idTxt').value = ct + 1;
        document.getElementById('lastConsumoTotalTxt').value = consumo[ct - 1].consumo_total;

    return consumo;
}

function mostrarConsumosEnTabla(data) {
    const tbody = document.getElementById('consumoTableBody');
    tbody.innerHTML = '';

    data.forEach(d => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${d.id}</td>
            <td>${d.id_factura}</td>
            <td>${d.consumo_total}</td>
            <td>${d.consumo}</td>
            <td>${d.fecha}</td>
            <td>
                <button onclick="printUpdateConsumoForm('${d.id}')">Editar</button>
                <button onclick="eliminarTurno('${d.id}')">Eliminar</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function calcularConsumo(id, consumoT, lastConsumoT) {
    let consumoTotal = document.getElementById(consumoT).value;
    let lastConsumoTotal = document.getElementById(lastConsumoT).value;
    let consumo = consumoTotal - lastConsumoTotal;
    document.getElementById(id).value = consumo;
}

// Función para guardar nuevo consumo
async function guardarConsumo(nuevoConsumo) {
    try {
        const response = await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: '1KPFeMzb1MdnLSho3Au6UfnnnowEQ8KRu1lutw_tEscg',
            range: 'Consumo_Diario!A:C',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [[nuevoConsumo.id, nuevoConsumo.id_factura, nuevoConsumo.consumo_total, nuevoConsumo.consumo, nuevoConsumo.fecha]]
            }
        });
        console.log('Datos guardados:', response.result);
        return true;
    } catch (err) {
        console.error('Error al guardar:', err);
        return false;
    }
}

document.getElementById('consumoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoConsumo = {
        id: document.getElementById('idTxt').value,
        id_factura: 'ACTUAL',
        consumo_total: document.getElementById('consumoTotalTxt').value,
        consumo: document.getElementById('consumoTxt').value,
        fecha: document.getElementById('fechaTxt').value
    };

    let consumoTxt = document.getElementById('consumoTxt').value;

    if (consumoTxt <= 0) {
        alert('El consumo debe ser mayor a 0.');
        return;
    }

    // Guardar el nuevo consumo
    const guardadoExitoso = await guardarConsumo(nuevoConsumo);

    if (guardadoExitoso) {
        // Limpiar el formulario
        const inputs = [
            'idTxt',
            'consumoTotalTxt',
            'consumoTxt',
            'fechaTxt',
        ];

        inputs.forEach(id => {
            document.getElementById(id).value = '';
        });

        // Actualizar la tabla
        await getTableConsumoDia();
    } else {
        alert('Error al guardar el Consumo.');
    }
});

async function printUpdateConsumoForm(id) {
    const consumo = await searchRow(id);

    document.getElementById('idUpd').value = consumo[0];
    document.getElementById('lastConsumoTotalUpd').value = consumo[2];
    document.getElementById('consumoTotalUpd').value = consumo[2];
    document.getElementById('consumoUpd').value = consumo[3];
    document.getElementById('fechaUpd').value = consumo[4];
}

async function modificarConsumo(consumo) {
    const update = [
        consumo.id,
        consumo.id_factura,
        consumo.consumo_total,
        consumo.consumo,
        consumo.fecha
    ];

    console.log('Fecha:', consumo.fecha);

    const row = parseInt(consumo.id) + 1;

    const response = await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: '1KPFeMzb1MdnLSho3Au6UfnnnowEQ8KRu1lutw_tEscg',
        range: `Consumo_Diario!A${row}:E${row}`,
        values: [update],
        valueInputOption: 'USER_ENTERED',
    });

    console.log('Status:', response.status);
    return response;
}

document.getElementById('updConsumoForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const consumo = await searchRow(document.getElementById('idUpd').value);
    const nuevoConsumo = consumo[3];

    if (consumo[2] != document.getElementById('consumoTotalUpd').value) {
        nuevoConsumo = parseInt(consumo[3]) + parseInt(document.getElementById('consumoUpd').value)
    }

    const updConsumo = {
        id: consumo[0],
        id_factura: consumo[1],
        consumo_total: document.getElementById('consumoTotalUpd').value,
        consumo: nuevoConsumo,
        fecha: document.getElementById('fechaUpd').value
    };

    let consumoUpd = document.getElementById('consumoUpd').value;

    if (consumoUpd < 0) {
        alert('El consumo no puede ser menor a 0.');
        return;
    }

    // Guardar el nuevo consumo
    const guardadoExitoso = await modificarConsumo(updConsumo);

    if (guardadoExitoso.status === 200) {
        // Limpiar el formulario
        const inputs = [
            'idTxt',
            'consumoTotalTxt',
            'consumoTxt',
            'fechaTxt',
            'idUpd',
            'lastConsumoTotalUpd',
            'consumoTotalUpd',
            'consumoUpd',
            'fechaUpd',
        ];

        inputs.forEach(id => {
            document.getElementById(id).value = '';
        });

        // Actualizar la tabla
        await getTableConsumoDia();
    } else {
        alert('Error al guardar el Consumo.');
    }
});