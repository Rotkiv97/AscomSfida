import { originalPatients, filteredPatients, cellName, inputValuePatient, messageError } from './Index.js';
import { RestOriginalInfo, CheckInputEdit, IsValidInputNameLastName, IsValidInputSex, ItAlreadyExists, ResetOriginalInfoEdit } from './Utils.js';
export function ButtonBack(button) {
    const infoRow = button.closest('.info-tr');
    if (infoRow) {
        RestOriginalInfo(infoRow);
        infoRow.style.display = 'table-row';
        infoRow.classList.add('show');
    }
}
export function CloseButton(button) {
    const infoRow = button.closest('.info-tr');
    if (infoRow) {
        const cell = document.querySelector('td.click-cell.active');
        if (cell) {
            cell.classList.remove('active');
        }
        else {
            console.log("non esiste .td.click-cell.active");
        }
        infoRow.style.display = 'none';
        infoRow.classList.remove('show');
    }
    else {
        console.log("non esiste una cell associata");
    }
}

export function DetailButton(button) {
    const infoRow = button.closest('.info-tr');
    if (infoRow) {
        const cell = document.querySelector('td.click-cell.active');
        //console.log(cellName.value);
        if (cell) {
            // Trova il paziente associato alla riga della tabella
            const patient = originalPatients.find(p => p.givenName === cell.closest('tr').querySelector('[data-param="Given Name"]').textContent
                && p.familyName === cell.closest('tr').querySelector('[data-param="Family Name"]').textContent);
            if (cellName.value === 'Parameters') {
                const url = `http://localhost:5120/Home/Parameters?id=${patient.id}`;
                window.open(url, '_blank');
            }
            else if (cellName.value === "State Alarm") {
                const changeInfo = infoRow.querySelector('.cell-info');
                if (changeInfo) {
                    changeInfo.innerHTML = `
                        <p>Cell: ${cellName.value}</p>
                        <p><strong>${cellName.value} = ${patient.alarmIsActive ? "true" : "false"}</strong></p>
                        <button class="button-info" id="back">back</button>`;
                }
            }
            else {
                const changeInfo = infoRow.querySelector('.cell-info');
                if (changeInfo) {
                    changeInfo.innerHTML = `
                        <p>Cell: ${cellName.value}</p>
                        <p><strong>${cellName.value} = ${cell.textContent}</strong></p>
                        <button class="button-info" id="back">back</button>`;
                }
            }
        }
        infoRow.style.display = 'table-row';
        infoRow.classList.add('show');
    }
}

export function EditButton(button) {
    const infoRow = button.closest('.info-tr');
    if (infoRow) {
        const cell = document.querySelector('td.click-cell.active');
        if (cell) {
            const changeInfo = infoRow.querySelector('.cell-info');
            if (cellName.value === 'Given Name' || cellName.value === 'Family Name' || cellName.value === 'Sex') {
                changeInfo.innerHTML = `
                    <p> Cell: ${ cellName.value }</p>
                    <input type="text" class="input-change" id="change-info" placeholder="  ${cellName.value}...  " />
                    <button class="button-info" id="confirm-button">Confirm</button>
                    <button class="button-info" id="cancell-input">Cancell</button>
                    <button class="button-info" id="back">back</button>`;

            }
            else {
                changeInfo.innerHTML = `
                    <p>Cell: ${cellName.value}</p>
                    <p class="p-error-message">Non-Editable Cell ...</p>
                    <button class="button-info" id="back">back</button>`;
            }
        }
        infoRow.style.display = 'table-row';
        infoRow.classList.add('show');
    }
}


export function InputChangeInfoPatient(input) {
    inputValuePatient.value = "";
    if (cellName.value === "Given Name" || cellName.value === "Family Name" || cellName.value === "Sex") {
        inputValuePatient.value = input.value;
    }
}


export function ConfirmButton(button) {
    // qui dovo ottenere il mio id 
    const finalInput = CheckInputEdit(inputValuePatient.value, button);

    if (finalInput != "" && finalInput != messageError.value) {
        const infoRow = button.closest('.info-tr');
        if (infoRow) {
            const cell = document.querySelector('td.click-cell.active');
            if (cell) {
                const changeInfo = infoRow.querySelector('.cell-info');
                changeInfo.innerHTML = `
                    <p>Change this parameter ${cellName.value} to : ${finalInput}</p>
                    <button class="button-info" id="yes"> Yes </button>
                    <button class="button-info" id="no"> No </button>`;
            }
        }
        infoRow.style.display = 'table-row';
        infoRow.classList.add('show');
    }
    else {
        const infoRow = button.closest('.info-tr');
        if (infoRow) {
            const cell = document.querySelector('td.click-cell.active');
            if (cell) {
                const changeInfo = infoRow.querySelector('.cell-info');
                changeInfo.innerHTML = `
                    <p style="color:red;">${finalInput}  to : ${cellName.value} </p>
                    <button class="button-info" id="error-back"> back </button>`;
            }
        }
        console.log("Error Final Input ", messageError.value);
        infoRow.style.display = 'table-row';
        infoRow.classList.add('show');
    }
}



export function Cancellbutton(button) {
    const cellInfo = button.closest('.cell-info');
    if (!cellInfo) {
        console.error(".cell-info non trovato!");
        return;
    }
    const input = cellInfo.querySelector('.input-change');
    if (input) {
        if (input.value.trim() !== "") {
            const originalPlaceholder = input.placeholder.trim();
            input.value = "";
            inputValuePatient.value = "";
            input.placeholder = originalPlaceholder;
        } 
    }
    else {
        console.error(".input-change non trovato!");
    }
}

export function YesButton(button) {
    //seconda conferma per utilizzare la bunzione PostAsyncPatient()
    if (button.id === 'yes') {
        
    }
}

export function NoButton(button) {
    if (button.id === 'no') {
        ResetOriginalInfoEdit();
    }
}

export function ErrorBackButton(button) {
    if (button.id === 'error-back') {
        ResetOriginalInfoEdit();
    }
}

export function PostAsyncPatient(){
    
}