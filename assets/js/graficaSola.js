// Obtener valores de los inputs
var dataInputs = document.getElementsByClassName('data-input');
var inputData = [];

var dateInputs = document.getElementsByClassName('date-input');
var inputDate = [];

for (var i = 0; i < dataInputs.length; i++) {
    var value = dataInputs[i].value.replace(',', '.'); // Reemplazar comas por puntos
    inputData.push(parseFloat(value)); // Convertir a número decimal
    inputDate.push(dateInputs[i].value);
}

// Crear el gráfico con Chart.js
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: inputDate,
        datasets: [{
            label: 'Despues de ultima factura',
            data: inputData,
            backgroundColor: [
                'rgba(63, 126, 221, 0.2)',
                'rgba(54, 162, 235, 0.2)',
            ],
            borderColor: [
                'rgba(63, 126, 221, 1)',
                'rgba(54, 162, 235, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
