import { originalPatients, filteredPatients, searchPatinets, cellName, messageError } from './Index.js';
import { DetailButton, CloseButton, EditButton, InputChangeInfoPatient, ConfirmButton, Cancellbutton, ButtonBack } from './DetailEdit.js';

export function normalizeDateISO(date) {
    return date.split('T')[0];
}
export function parseDateToISO(date) {
    if (!date) return null;
    const [day, month, year] = date.split('/').map(part => part.trim());
    if (!day || !month || !year) {
        console.log('Formato di data non valido:', date);
        return null;
    }

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

export function RestOriginalInfo() {
    document.querySelectorAll('.cell-info').forEach(cellInfo => {
        cellInfo.innerHTML = `
            <p>Cell: ${cellName.value}</p>
            <div class="detail-edit">
                <button class="button-info" id="detail">Detail</button>
                <button class="button-info" id="edit">Edit</button>
                <button class="button-info" id="close">Close</button>
            </div>`;

        const detailButton = cellInfo.querySelector('#detail');
        const editButton = cellInfo.querySelector('#edit');
        const closeButton = cellInfo.querySelector('#close');

        if (detailButton) {
            detailButton.addEventListener('click', () => DetailButton(detailButton));
        }
        if (editButton) {
            editButton.addEventListener('click', () => EditButton(editButton));
        }
        if (closeButton) {
            closeButton.addEventListener('click', () => CloseButton(closeButton));
        }
    });
}

export function ResetOriginalInfoEdit() {
    document.querySelectorAll('.cell-info').forEach(cellInfo => {
        if (cellName.value === 'Given Name' || cellName.value === 'Family Name' || cellName.value === 'Sex') {
            cellInfo.innerHTML = `
                    <p> Cell: ${cellName.value}</p>
                    <input type="text" class="input-change" id="change-info" placeholder="  ${cellName.value}...  " />
                    <button class="button-info" id="confirm-button">Confirm</button>
                    <button class="button-info" id="cancell-input">Cancell</button>
                    <button class="button-info" id="back">back</button>`;

        }
        else {
            cellInfo.innerHTML = `
                    <p>Cell: ${cellName.value}</p>
                    <p class="p-error-message">Non-Editable Cell ...</p>
                    <button class="button-info" id="back">back</button>`;
        }

        const input = cellInfo.querySelector('#change-info');
        const confirm = cellInfo.querySelector('#confirm-button');
        const cancell = cellInfo.querySelector('#cancell-input');
        const back = cellInfo.querySelector('#back');

        if (input) {
            input.addEventListener('input', function (event) {
                InputChangeInfoPatient(event.target);
            });
        }

        if (confirm) {
            confirm.addEventListener('click', function (event) {
                ConfirmButton(event.target);
            });
        }
        if (cancell) {
            input.addEventListener('click', () => Cancellbutton(cancell))
        }
        if (back) {
            input.addEventListener('click', () => ButtonBack(back));
        }
    });
}

export function GestEnventClickCell(group) {
    const cellActive = document.querySelector('td.click-cell.active');
    const shownInfo = document.querySelector('.info-tr.show');

    if (cellActive && cellActive !== group) {
        if (shownInfo) {
            RestOriginalInfo();
            shownInfo.style.display = 'none';
            shownInfo.classList.remove('show');
        }
        cellActive.classList.remove('active');
    }

    const tr = group.closest('tr');
    let infoRow = tr.nextElementSibling;

    cellName.value = group.getAttribute('data-param') || group.textContent;

    if (group.classList.contains('active')) {
        group.classList.remove('active');
        if (infoRow && infoRow.classList.contains('info-tr')) {
            infoRow.style.display = 'none';
            infoRow.classList.remove('show');
        }
    }
    else {
        group.classList.add('active');
        if (infoRow && infoRow.classList.contains('info-tr')) {
            const cellTmp = infoRow.querySelector('.cell-info p');
            if (cellTmp)
                cellTmp.textContent = `Cell: ${cellName.value}`;
            infoRow.style.display = 'table-row';
            infoRow.classList.add('show');
        }
        else {
            const newRow = document.createElement('tr');
            newRow.classList.add('info-tr');

            const td = document.createElement('td');
            td.colSpan = tr.children.length;
            td.innerHTML = `
                <div class="cell-info">
                    <p>Cell: ${cellName}</p>
                    <div class="detail-edit">
                        <button class="button-info" id="detail">Detail</button>
                        <button class="button-info" id="edit">Edit</button>
                        <button class="button-info" id="back">Back</button>
                    </div>
                </div>`;
            newRow.appendChild(td);
            tr.parentNode.insertBefore(newRow, tr.nextElementSibling);

            newRow.style.display = 'table-row';
            newRow.classList.add('show');
        }
        RestOriginalInfo();
    }
}

//questa funzione mi restituisce la tabella con la lista dei patients aggiornati
export function UpDateTablePatient(PatientFilter) {
        const table = document.querySelector('.patient-list tbody');
        table.innerHTML = '';

        PatientFilter.forEach(patient => {
            const row = `
                <tr>
                    <td class="click-cell" data-param="Given Name">${patient.givenName}</td>
                    <td class="click-cell" data-param="Family Name">${patient.familyName}</td>
                    <td class="click-cell" data-param="Sex">${patient.sex}</td>
                    <td class="click-cell" data-param="Birth Date">${new Date(patient.birthDate).toLocaleDateString()}</td>
                    <td class="click-cell" data-param="Parameters">${patient.parameters.length}</td>
                    <td class="click-cell" data-param="State Alarm">
                        <span class="alarm-indicator ${patient.alarmIsActive ? "red" : "green"}"></span>
                    </td>
                </tr>
                <tr class="info-tr">
                    <td colspan="6">  
                        <div class="cell-info">
                            <p>Cell :</p>
                            <div class="detail-edit">
                                <button class="button-info" id="detail">Detail</button>
                                <button class="button-info" id="edit">Edit</button>
                                <button class="button-info" id="close">Close</button>
                            </div>
                        </div>
                    </td>
                </tr>`;
            table.insertAdjacentHTML('beforeend', row);
        })
        document.querySelectorAll('td.click-cell').forEach(function (group) {
            group.addEventListener('click', function () {
                GestEnventClickCell(group);
        })
    })

    document.querySelectorAll('.button-info').forEach(function (button) {
        if (button.id === 'detail') {
            button.addEventListener('click', function () {
                DetailButton(button);
            })
        }
        if (button.id === 'edit') {
            button.addEventListener('click', function () {
                EditButton(button);
            })
        }
        if (button.id === 'close') {
            button.addEventListener('click', function () {
                CloseButton(button);
            })
        }
    })
}

//questa funzione mi restituisce i dati json in text 
export function getPatients() {
    const patientsData = document.getElementById('patients-data').textContent;

    try {
        const parsedData = JSON.parse(patientsData);
        originalPatients.length = 0;
        originalPatients.push(...(parsedData.patients || []));
    } catch (error) {
        console.error("Errore durante il parsing del JSON:", error);
    }
    return originalPatients;
}


export function IsValidInputNameLastName(string) {
    const check = /^[A-Za-z]+(?:\s[A-Za-z]+)?$/;
    if (!check.test(string) || string.length < 2) {
        return false;
    }
    return true;
}

export function IsValidInputSex(string) {
    const check = ["M", "m", "F", "f"];
    return check.includes(string) ? true : false;
}

export function ItAlreadyExists(tmpString, button) {

    const infoRow = button.closest('.info-tr');
    if (!infoRow) {
        console.log("Nessuna riga trovata");
        return true;
    }


    // Estrarre i valori della riga attiva
    const activeRow = infoRow.previousElementSibling;
    const givenName = activeRow.querySelector('[data-param="Given Name"]').textContent.trim();
    const familyName = activeRow.querySelector('[data-param="Family Name"]').textContent.trim();
    const sex = activeRow.querySelector('[data-param= "Sex"]').textContent.trim();
    const birthDateString = activeRow.querySelector('[data-param="Birth Date"]').textContent.trim();
    const birthDate = normalizeDateISO(parseDateToISO(birthDateString));

    const patient = originalPatients.find(p => {
        let tmpDatePatinet = normalizeDateISO(p.birthDate);
        //console.log(birthDate, " ", tmpDatePatinet);
        return (p.givenName === givenName && p.familyName === familyName && p.sex === sex && tmpDatePatinet === birthDate);
    });

    if (!patient) {
        console.log("Paziente non trovato");
        return true;
    }

    // Confronto i dati modificati con gli altri pazienti
    const isDuplicate = originalPatients.some(p => {
        let tmpDatePatinet = normalizeDateISO(p.birthDate);
        //console.log(birthDate , " ", tmpDatePatinet);
        if (p.id === patient.id)
            return false;
        if (cellName.value === "Given Name" && p.givenName === tmpString && p.familyName === familyName && p.sex === sex && tmpDatePatinet === birthDate)
            return true;
        else if (cellName.value === "Family Name" && p.givenName === givenName && p.familyName === tmpString && p.sex === sex && tmpDatePatinet === birthDate)
            return true;
        else if (cellName.value === "Sex" && p.givenName === givenName && p.familyName === familyName && p.sex === tmpString && tmpDatePatinet === birthDate)
            return true;
    });

    return isDuplicate;
}

export function CheckInputEdit(input, button) {
    let tmpString = input;
    tmpString.trim();

    if (cellName.value === "Given Name" || cellName.value === "Family Name") {
        if (IsValidInputNameLastName(tmpString)) {
            //normalizzo e capitalizzo i vari caratteri della string 
            tmpString = tmpString.split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            if (ItAlreadyExists(tmpString, button)) {
                messageError.value = `Error: It already exists "${input}"`;
                return messageError.value;
            }
            else {
                return tmpString;
            }
        }
    }
    else if (cellName.value === "Sex") {
        if (IsValidInputSex(tmpString)) {
            tmpString = tmpString.split(/\s+/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
            if (ItAlreadyExists(tmpString, button)) {
                messageError.value = `Error: It already exists "${input}"`;
                return messageError.value;
            }
            else {
                return tmpString;
            }
        }
    }
    messageError.value = `Error: Invalid Input = "${input}" `;
    return messageError.value;
}