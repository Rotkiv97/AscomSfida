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
        public HomeController(PatientService patientService)
        {
            _patientService = patientService;
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

            // Passa il JSON alla vista
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
    }
}

