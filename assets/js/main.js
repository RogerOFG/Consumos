function popupGasto(){
    const popupGasto = document.getElementById('popupGasto');
    const popupFactura = document.getElementById('popupFactura');

    var now = new Date();
    var day = String(now.getDate()).padStart(2, '0');
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');

    var formattedDateTime = day + '/' + month + ' - ' + hours + ':' + minutes;

    const fechaActual = document.getElementById('fechaActual');

    fechaActual.value = formattedDateTime;
    popupGasto.classList.add('popup--active');
    popupFactura.classList.remove('popup--active');
}

function popupFactura(){
    const popupFactura = document.getElementById('popupFactura');
    const popupGasto = document.getElementById('popupGasto');

    popupFactura.classList.add('popup--active');
    popupGasto.classList.remove('popup--active');
}

function closeForms(){
    const popupGasto = document.getElementById('popupGasto');
    const popupFactura = document.getElementById('popupFactura');
    const popupUpdate = document.getElementById('popupUpdate');

    popupFactura.classList.remove('popup--active');
    popupGasto.classList.remove('popup--active');
    popupUpdate.classList.remove('popup--active');
}

function chooseDate(){
    const popupDate = document.getElementById('popupDate');
    const formDateMonth = document.getElementById('formDateMonth');

    formDateMonth.classList.remove('hidde');
    popupDate.classList.add('popup--active')
}

function update(){
    const popup = document.getElementById('popupUpdate');

    var now = new Date();
    var day = String(now.getDate()).padStart(2, '0');
    var month = String(now.getMonth() + 1).padStart(2, '0');
    var hours = String(now.getHours()).padStart(2, '0');
    var minutes = String(now.getMinutes()).padStart(2, '0');

    var formattedDateTime = day + '/' + month + ' - ' + hours + ':' + minutes;

    const fechaActual = document.getElementById('fechaAct');

    fechaActual.value = formattedDateTime;

    popup.classList.add('popup--active');
}

const dateChoose = document.getElementById('dateChoose');
const monthOP = document.querySelectorAll('.monthOP');
const dayOP = document.querySelectorAll('.dayOP');

const formDateMonth = document.getElementById('formDateMonth');
const formDateDay = document.getElementById('formDateDay');

const popupDate = document.getElementById('popupDate');

let monthSelected = '';
let daySelected = '';

monthOP.forEach(function(element) {
    element.addEventListener('click', function() {
        monthSelected = element.textContent.trim().replace('.', ' ');
        formDateMonth.classList.add('hidde');
        formDateDay.classList.remove('hidde');
    });
});

dayOP.forEach(function(element) {
    element.addEventListener('click', function() {
        daySelected = element.textContent.trim();
        formDateDay.classList.add('hidde');
        popupDate.classList.remove('popup--active');
        updateDateChoose();
    });
});

function updateDateChoose() {
    if (monthSelected && daySelected) {
        dateChoose.value = monthSelected + daySelected;
    }
}

// Modificar fecha de registro Actual
const checkboxes = document.querySelectorAll('.checkbox');
const inputFecha = document.getElementById('fechaTxt');
const inputFechaG = document.getElementById('fechaGuardada').value;

inputFecha.value = inputFechaG;

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        checkboxes.forEach(otherCheckbox => {
            if (otherCheckbox !== checkbox) {
                otherCheckbox.checked = false;
            }
        });

        const associatedInputId = checkbox.getAttribute('data-target');
        const associatedInput = document.getElementById(associatedInputId);

        if (associatedInput) {
            inputFecha.value = associatedInput.value;
        }
    });
});