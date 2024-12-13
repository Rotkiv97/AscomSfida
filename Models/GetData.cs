using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace AscomWebApp
{
    public class Parameter
    {
        [JsonPropertyName("id")]
        public int id { get; set; }

        [JsonPropertyName("name")]
        public string name { get; set; } = string.Empty;

        [JsonPropertyName("value")]
        public double value { get; set; }

        [JsonPropertyName("alarm")]
        public bool alarm { get; set; }
    }

    public class GetDataPatient
    {
        [JsonPropertyName("id")]
        public int id { get; set; }
        [JsonPropertyName("familyName")]
        public string familyName { get; set; } = string.Empty;
        [JsonPropertyName("givenName")]
        public string givenName { get; set; } = string.Empty;
        [JsonPropertyName("birthDate")]
        public DateTime birthDate { get; set; }
        [JsonPropertyName("sex")]
        public string sex { get; set; } = string.Empty;
        [JsonPropertyName("parameters")]
        public List<Parameter> parameters { get; set;} = new List<Parameter>();

        [JsonPropertyName("hasActiveAlarm")]
        public bool alarmIsActive => parameters.Any(p => p.alarm);
    }

    public class Patients
    {
        public List<GetDataPatient> patients { get; set; } = new List<GetDataPatient>();

        public void AddPatient(GetDataPatient patient)
        {
            if (patient != null)
                patients.Add(patient);
        }

        public void GetPatients()
        {
            Console.WriteLine($"{patients.Count}");
            if(patients.Count > 0)
            {
                foreach (var item in patients)
                {
                    Console.WriteLine($"ID: {item.id}, Nome: {item.givenName} {item.familyName}, Data di nascita: {item.birthDate}");
                }
            }
        }

    }
}
