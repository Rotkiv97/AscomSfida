### SFIDA ASCOM 

## Passaggi e Sruttura del progetto
```
1) Ho utilizzato Visual Studio Code 2022, ed ho creato un progetto ASP.NET core.
2) Ho impostao le cartelle aggiungendo le seguenti cartelle (Controlles, Models, Views) e le altre sotto cartelle.
3) Ho impostato il file Program.cs nella quale ho gestito le funzionalità del progetto.
    es: 
    builder.Services.AddControllersWithViews(); 
    builder.Services.AddHttpClient<PatientService>();
    builder.Services.AddRazorPages();
4) file: (/Models/GetIPAData.cs) nel costruttore di PatientService ho fatto la richiesta tramite Authorization della API. 
5) Ho fatto la richiesta API con questo endPoint GetAsync(Patient/GetList).
6) API mi restituisce un file json che deserilizzo all'interno di una lista di Models GetDataPatient.



```