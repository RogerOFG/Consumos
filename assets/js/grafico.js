document.addEventListener('DOMContentLoaded', function() {
    // Crear gráficos para cada factura
    document.querySelectorAll('.chart-container').forEach(container => {
        var chartId = container.querySelector('canvas').id;
        var facturaId = chartId.split('-')[1];

        // Obtener valores de los inputs correspondientes a esta factura
        var dataInputs = document.getElementsByClassName('data-input-' + facturaId);
        var dateInputs = document.getElementsByClassName('date-input-' + facturaId);
        var inputData = [];
        var inputDate = [];

        for (var i = 0; i < dataInputs.length; i++) {
            var value = dataInputs[i].value.replace(',', '.'); // Reemplazar comas por puntos
            inputData.push(parseFloat(value)); // Convertir a número decimal
            inputDate.push(dateInputs[i].value);
        }

        // Crear el gráfico con Chart.js
        var ctx = document.getElementById(chartId).getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: inputDate,
                datasets: [{
                    label: 'Gastos - Factura ' + facturaId,
                    data: inputData,
                    backgroundColor: 'rgba(63, 126, 221, 0.2)',
                    borderColor: 'rgba(63, 126, 221, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    });
});
