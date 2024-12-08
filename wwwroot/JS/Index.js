let originalPatients = [];
let filteredPatients = [];// Lista dei pazienti temporanea
let searchPatinets = [];

document.addEventListener('DOMContentLoaded', function () {
    getPatients();
    document.querySelectorAll('.double-choice').forEach(function (group) {
        group.querySelectorAll('button').forEach(function (button) {
            button.addEventListener('click', function () {
                if (button.classList.contains('active')) {
                    button.classList.remove('active');
                } else {
                    group.querySelectorAll('button').forEach(function (btn) {
                        btn.classList.remove('active');
                    });
                    button.classList.add('active');
                }
            });
        });
    });
    document.getElementById('button-filter').addEventListener('click', FilterEndSortPatient);
    document.getElementById('button-restfilter').addEventListener('click', ResetFilters);
    document.getElementById('search-GivenName').addEventListener('input', SearchPatient);
    document.getElementById('search-FamilyName').addEventListener('input', SearchPatient);
});

// questa funzione mi restituisce i dati json in text 
function getPatients() {
    const patientsData = document.getElementById('patients-data').textContent;

    try {
        const parsedData = JSON.parse(patientsData);
        originalPatients = parsedData.patients || [];
    } catch (error) {
        console.error("Errore durante il parsing del JSON:", error);
    }
    return originalPatients;
}

//questa funzione mi rende la tabella aggiornata dopo che è stata filtrata ed ordinata
function UpDateTablePatient(PatientFilter) {

    const table = document.querySelector('.patient-list tbody');
    table.innerHTML = '';

    PatientFilter.forEach(patient => {
        const row = `
            <tr>
                <td>${patient.givenName}</td>
                <td>${patient.familyName}</td>
                <td>${patient.sex}</td>
                <td>${new Date(patient.birthDate).toLocaleDateString()}</td>
                <td>${patient.parameters.length}</td>
                <td><span class="alarm-indicator ${patient.alarmIsActive ? 'red' : 'green'}"></span></td>
                <td>Edit</td>
            </tr>`;
        table.insertAdjacentHTML('beforeend', row);
    })
}

//questa funzione gestique i filtri attivi e me li orgina, e mi rende alla fine una nuova tabella aggiornata grazie a UpDateTablePatient
function FilterEndSortPatient() {
    // 1) ottenengo la lista di oggetti patient e se il search dei Pazineti è attivo filtro l'array di  searchPatinets
    // 2) controllo quali filtri sono attivi o se sono attivi
    // 3) ordino i pazienti a seconda del filtro
    // 4) creo una nuova tabella
    try {
        let patients = [];
        if (searchPatinets.length > 0) {
            patients = [...searchPatinets];
        }
        else
            patients = [...originalPatients]; // Copia della lista originale
        filteredPatients = [];

        if (!Array.isArray(patients)) {
            console.error("patients non è un array:", patients);
            return;
        }

        const givenName = document.querySelector('.givenName-filter .active')?.textContent;    // Ordinamento GivenName
        const familyName = document.querySelector('.familyName-filter .active')?.textContent;  // Ordinamento FamilyName
        const sex = document.querySelector('.sex-filter .active')?.textContent;                // Filtro per sesso
        const birthDate = document.querySelector('.birthDate-filter .active')?.textContent;    // Ordinamento BirthDate
        const stateAlarm = document.querySelector('.stateAlarm-filter .active')?.textContent;  // Filtro per stato dell'allarme
        const parameters = document.querySelector('.parameters-filter .active')?.textContent;   // Ordinamento Paremetri

        for (let patient of patients) {
            let isPositive = true;
            if (sex) {
                if (sex && patient.sex !== sex) {
                    isPositive = false;
                }
            }

            if (stateAlarm) {
                let isActiveAlarm = stateAlarm === 'Active'; // Converte in booleano
                if (patient.alarmIsActive !== isActiveAlarm) {
                    isPositive = false;
                }
            }
            if (!isPositive)
                continue;
            filteredPatients.push(patient);
        }

        //questo è un sort dei filtri è a cascata dove do priorita al nome, cognome, data di nascita, e N parametri
        // in questo modo non annullo il sort precedente
        filteredPatients.sort((a, b) => {
            if (givenName) {
                if (givenName === 'A-Z') {
                    const tmp = a.givenName.localeCompare(b.givenName);
                    if (tmp !== 0)
                        return tmp;
                }
                else {
                    const tmp = b.givenName.localeCompare(a.givenName);
                    if (tmp !== 0)
                        return tmp;
                }
            }
            if (familyName) {
                if (familyName === 'A-Z') {
                    const tmp = a.familyName.localeCompare(b.familyName);
                    if (tmp !== 0)
                        return tmp;
                }
                else {
                    const tmp = b.familyName.localeCompare(a.familyName);
                    if (tmp !== 0)
                        return tmp;
                }
            }

            if (birthDate) {
                if (birthDate === 'Old') {
                    const tmp = new Date(a.birthDate) - new Date(b.birthDate);
                    if (tmp !== 0)
                        return tmp;
                }
                else {
                    const tmp = new Date(b.birthDate) - new Date(a.birthDate);
                    if (tmp !== 0)
                        return tmp;
                }
            }
            if (parameters) {
                if (parameters === 'High') {
                    const tmp = b.parameters.length - a.parameters.length;
                    if (tmp !== 0)
                        return tmp;
                }
                else {
                    const tmp = a.parameters.length - b.parameters.length;
                    if (tmp !== 0)
                        return tmp;
                }
            }
            return 0;
        })
    }
    catch (error) {
        console.log("Errore durante l'esecuzione di FilterEndSortPatient:", error);
    }

    if (filteredPatients.length === 0) {
        console.log("Nessun paziente trovato per i criteri di filtro.");
    }

    UpDateTablePatient(filteredPatients);
}


//questa funziona mi restituisce la tabella originale prima che fossero applicati dei filtri di conseguenza vengo riordinati per id 
// e resetto anche le attivazioni di filtri;
function ResetFilters() {
    filteredPatients = [...originalPatients];
    searchPatinets = [];
    document.getElementById('search-GivenName').value = '';
    document.getElementById('search-FamilyName').value = '';
    document.querySelectorAll('.double-choice button').forEach(button => button.classList.remove('active'));
    UpDateTablePatient(originalPatients);
}


function SearchPatient(event) {
    searchPatinets = [];
    const idSearch = event.target.id;
    const valueSearch = event.target.value.trim().toLowerCase();
    let name = '';
    let lastname = '';

    if (idSearch === 'search-GivenName') {
        name = valueSearch;
        console.log("Sta modificando l'input del ->", idSearch);
    } else if (idSearch === 'search-FamilyName') {
        lastname = valueSearch;
        console.log("Sta modificando l'input del ->", idSearch);
    } else {
        console.log("Input non riconosciuto:", idSearch);
    }

    if (!name && !lastname) {
        UpDateTablePatient(originalPatients);
        return ;
    }

    for (let item of originalPatients) {
        let isName = false;
        let isLastName = false;

        if (name) {
            isName = item.givenName.toLowerCase().includes(name.toLowerCase());
        }
        if (lastname) {
            isLastName = item.familyName.toLowerCase().includes(lastname.toLowerCase());
        }
        if (isLastName || isName)
            searchPatinets.push(item);
    }

    searchPatinets.sort((a, b) => {
        if (name && a.givenName.toLowerCase().startsWith(name) !== b.givenName.toLowerCase().startsWith(name)) {
            return b.givenName.toLowerCase().startsWith(name) - a.givenName.toLowerCase().startsWith(name);
        }
        if (lastname && a.familyName.toLowerCase().startsWith(lastname) !== b.familyName.toLowerCase().startsWith(lastname)) {
            return b.familyName.toLowerCase().startsWith(lastname) - a.familyName.toLowerCase().startsWith(lastname);
        }
        return a.givenName.localeCompare(b.givenName) || a.familyName.localeCompare(b.familyName);
    });

    UpDateTablePatient(searchPatinets);
}