import { UpDateTablePatient, RestOriginalInfo, GestEnventClickCell, getPatients } from './Utils.js';
import { CloseButton, DetailButton, ButtonBack, EditButton, InputChangeInfoPatient, ConfirmButton, Cancellbutton, YesButton, ErrorBackButton, NoButton, PostAsyncPatient } from './DetailEdit.js';
import { FilterEndSortPatient, GestButtonFilterSort, ResetFilters, SearchPatient } from './FilterSort.js';


export let originalPatients = []; // lista da appoggio con in pazienti originali
export let filteredPatients = [];// Lista dei pazienti temporanea
export let searchPatinets = []; // lista temporanea dei pazienti trovati
export let cellName = { value: "" };
export let inputValuePatient = { value: "" };
export let messageError = { value: "" };

document.addEventListener('DOMContentLoaded', function () {
    getPatients();
    document.querySelectorAll('.double-choice').forEach(function (group) {
        GestButtonFilterSort(group);
    });
    document.getElementById('button-filter').addEventListener('click', FilterEndSortPatient);
    document.getElementById('button-restfilter').addEventListener('click', ResetFilters);
    document.getElementById('search-GivenName').addEventListener('input', SearchPatient);
    document.getElementById('search-FamilyName').addEventListener('input', SearchPatient);
   // document.getElementById('change-info').addEventListener('input', ChangeInfoPatint);
    document.querySelectorAll('td.click-cell').forEach(function (group) {
        group.addEventListener('click', function () {
            GestEnventClickCell(group);
        })
    })
        document.querySelectorAll('.button-info').forEach(function (button) {
        if (button.id.startsWith('detail-')) {
            button.addEventListener('click', function () {
                const patientId = button.id.split('-')[1];
                DetailButton(patientId);
            });
        }
        if (button.id.startsWith('edit-')) {
            button.addEventListener('click', function () {
                const patientId = button.id.split('-')[1];
                EditButton(patientId);
            });
        }
        if (button.id.startsWith('close-')) {
            button.addEventListener('click', function () {
                const patientId = button.id.split('-')[1];
                CloseButton(patientId);
            });
        }
    });

    document.addEventListener('click', function (event) {
        if (event.target.id === 'back') {
            ButtonBack(event.target);
        }
    })

    document.addEventListener('input', function (event) {
        if (event.target.id === 'change-info')
            InputChangeInfoPatient(event.target);
    })

    document.addEventListener('click', function (event) {
        if (event.target.id === 'confirm-button') {
            ConfirmButton(event.target);
        }
    })

    document.addEventListener('click', function (event) {
        if (event.target.id === 'cancell-input') {
            Cancellbutton(event.target);
        }
    });

    document.addEventListener('click', function (event) {
        if (event.target.id === 'yes') {
            YesButton(event.target);
        }
    })

    document.addEventListener('click', function (event) {
        if (event.target.id === 'no') {
            NoButton(event.target);
        }
    })

    document.addEventListener('click', function (event) {
        if (event.target.id === 'error-back') {
            ErrorBackButton(event.target);
        }
    })

});
