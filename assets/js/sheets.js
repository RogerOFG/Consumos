let consumo;

async function getTableConsumoDia() {
    let response;
    try {
        response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1KPFeMzb1MdnLSho3Au6UfnnnowEQ8KRu1lutw_tEscg',
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
            consumo_total: parseInt(row[2]),
            consumo: parseInt(row[3]),
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
                <button onclick="editarTurno(${JSON.stringify(d)})">Editar</button>
                <button onclick="eliminarTurno('${d.id}')">Eliminar</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function calcularConsumo(){
    let consumoTotal = document.getElementById('consumoTotalTxt').value;
    let lastConsumoTotal = document.getElementById('lastConsumoTotalTxt').value;
    let consumo = consumoTotal - lastConsumoTotal;
    document.getElementById('consumoTxt').value = consumo;
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
        id_factura: document.getElementById('idFacturaTxt').value,
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
        // document.getElementById('turnoForm').reset();
        document.getElementById('idTxt').value = "";
        document.getElementById('idFacturaTxt').value = "";
        document.getElementById('consumoTotalTxt').value = "";
        document.getElementById('consumoTxt').value = "";
        document.getElementById('fechaTxt').value = "";

        // Actualizar la tabla
        await getTableConsumoDia();
    } else {
        alert('Error al guardar el Consumo.');
    }
});