import { originalPatients, filteredPatients, cellName, inputValuePatient, messageError } from './Index.js';
import { RestOriginalInfo, CheckInputEdit, IsValidInputNameLastName, IsValidInputSex, ItAlreadyExists, ResetOriginalInfoEdit, parseDateToISO } from './Utils.js';
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
    const finalInput = CheckInputEdit(inputValuePatient.value, button);
    inputValuePatient.value = "";
    if (finalInput != "" && finalInput != messageError.value) {
        const infoRow = button.closest('.info-tr');
        if (infoRow) {
            const cell = document.querySelector('td.click-cell.active');
            if (cell) {
                inputValuePatient.value = finalInput;
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
    console.log(inputValuePatient.value);
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

async function PostAsyncPatient(patient) {
    if (patient.alarmIsActive === true || patient.alarmIsActive === false) {
        delete patient.alarmIsActive;
    }

    if (patient.birthDate) {
        let dateCustom = new Date(patient.birthDate);
        if (isNaN(dateCustom.getTime())) {
            console.error("Data di nascita non valida:", patient.birthDate);
            return;
        }
        patient.birthDate = dateCustom.toISOString();
    }
    //console.log("Dati inviati al server:", JSON.stringify(patient, null, 2));
    try {
        const response = await fetch('http://localhost:5120/Home/PostPatientApi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patient),
        });

        if (response.ok) {
            const text = await response.text();
            if (text) {
                const serverResult = JSON.parse(text);
                console.log("ServerResult:", serverResult);
            }
            else {
                console.warn("Risposta vuota dal server.");
            }
            originalPatients.length = 0;
            window.location.reload();
        } else {
            console.error("Errore nella risposta del server:", response.status, response.statusText);
        }
    }
    catch (error) {
        console.error("Errore nella chiamata PostAsyncPatient:", error);
    }
}

export async function YesButton(button) {
    //seconda conferma per utilizzare la funzione PostAsyncPatient()
    console.log("YesButton");

    if (button.id === 'yes') {
        const infoRow = button.closest('.info-tr');
        if (!infoRow) {
            console.log("Nessuna Riga Trovata");
            return false;
        }

        //trovo e mi prendo i parametri della riga un cui sono
        const activeRow = infoRow.previousElementSibling;
        const givenName = activeRow.querySelector('[data-param="Given Name"]').textContent.trim();
        const familyName = activeRow.querySelector('[data-param="Family Name"]').textContent.trim();
        const sex = activeRow.querySelector('[data-param= "Sex"]').textContent.trim();
        const birthDateString = activeRow.querySelector('[data-param="Birth Date"]').textContent.trim();
        const birthDate = parseDateToISO(birthDateString);


        const patient = originalPatients.find(p => {
            const tmpDatePatinet = new Date(p.birthDate).toISOString().split('T')[0];
            return (p.givenName === givenName && p.familyName === familyName && p.sex === sex && birthDate === tmpDatePatinet);
        });
        if (patient) {
            console.log(cellName.value);
            if (cellName.value === "Given Name") {
                patient.givenName = inputValuePatient.value;
            }
            else if (cellName.value === "Family Name") {
                patient.familyName = inputValuePatient.value;
            }
            else if (cellName.value === "Sex") {
                patient.sex = inputValuePatient.value;
            }
            await PostAsyncPatient(patient);
        }
        else {
            console.log("patient non trovato");
        }
    }
    inputValuePatient.value = "";
    CloseButton(button);
    ResetOriginalInfoEdit();
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
