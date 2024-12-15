using Microsoft.AspNetCore.Mvc;
using GetIPAData.Services;
using System.Threading.Tasks;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Diagnostics;

namespace AscomWebApp
{
    public class HomeController : Controller
    {
        private readonly PatientService _patientService;
        private readonly ILogger<PatientService> _logger;
        public HomeController(PatientService patientService, ILogger<PatientService> logger)
        {
            _patientService = patientService;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            var patientsList = await _patientService.GetPatientsAsync();
            Patients patients = new Patients();

            if (patientsList != null)
            {
                foreach (var patient in patientsList)
                {
                    patients.AddPatient(patient);
                }
            }
            var patientsJson = JsonConvert.SerializeObject(patients);
            ViewBag.PatientsJson = patientsJson;
            return View(patients);
        }

        [HttpGet]
        public async Task<IActionResult> Parameters(int id)
        {
            var patientList = await _patientService.GetPatientsAsync();
            var patient = patientList.FirstOrDefault(p => p.id == id);
            if (patient == null) {
                Debug.WriteLine("patient  non trovato e vouto");
                return NotFound();
            }
            return View(patient);
        }

        [HttpPost]
        public async Task<IActionResult> PostPatientApi([FromBody] GetDataPatient patient)
        {

            //_logger.LogInformation("Dati ricevuti dal client: " + JsonSerializer.Serialize(patient));
            if (patient == null)
            {

                return BadRequest("Dati del paziente non validi.");
            }
            else
            {
                _logger.LogInformation("il patient e =  {patint}", patient);
            }
            try
            {
                var response = await _patientService.PostPatinetAsync(patient);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    if (string.IsNullOrEmpty(content))
                    {
                        return Ok(new { success = true, message = "Paziente aggiornato con successo" });
                    }
                    return Ok(content);
                }
                else
                {
                    return StatusCode((int)response.StatusCode, "Errore nell'aggiornamento del paziente.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}

