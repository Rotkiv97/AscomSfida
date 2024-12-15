using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using AscomWebApp;
using System.Text.Json.Serialization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Collections.Immutable;
using Microsoft.AspNetCore.SignalR;

namespace GetIPAData.Services
{
    public class PatientService
    {
        private readonly HttpClient _httpClient;

        public PatientService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://mobile.digistat.it/CandidateApi/");
            string user = "test";
            string password = "TestMePlease!";
            string authValue = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{user}:{password}"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", authValue);
        }

        public async Task<List<GetDataPatient>?> GetPatientsAsync()
        {
            try
            {
                Patients patientInstance = new Patients();
                HttpResponseMessage response = await _httpClient.GetAsync("Patient/GetList");
                if (response.IsSuccessStatusCode)
                {
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var patientsList = JsonSerializer.Deserialize<List<GetDataPatient>>(responseBody);

                    if (patientsList != null)
                    {
                        //foreach (var item in patientsList)
                        //{
                        //    Console.WriteLine($"00) ID: {item.id}, Nome: {item.givenName} {item.familyName}, Sex: {item.sex} , Data: {item.birthDate}");
                        //}

                        var tmplistPatient = CheckedPatientList(patientsList);
                        var finalistPatient = CheckDoubleID(tmplistPatient);
                        foreach (var item in finalistPatient)
                        {
                            if(patientInstance.patients != null)
                                patientInstance.AddPatient(item);
                        }
                        //patientInstance.GetPatients();//funzione di controllo e stampa se la lista è stata pienata corretamente
                        return finalistPatient;
                    }
                    else
                    {
                        return null;
                    }
                    
                }
                else
                {
                    throw new Exception($"Errore nella chiamata API: {response.StatusCode}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                return null;
            }
        }

        public async Task<HttpResponseMessage> PostPatinetAsync(GetDataPatient patient)
        {
            try
            {
                var jsonContent = new StringContent(JsonSerializer.Serialize<GetDataPatient>(patient), Encoding.UTF8, "application/json");
                return await _httpClient.PostAsync("Patient/Update", jsonContent);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Eccezione nel PostPatinetAsync: {ex.Message}");
                return null;
            }
        }

        public List<GetDataPatient> CheckDoubleID(List<GetDataPatient> list)
        {
            var tmplist = new List<GetDataPatient>();
            var tmpId = new HashSet<int>();
            var uniquePatients = new HashSet<string>();

            foreach (var item in list)
            {
                string patientKey = $"{item.familyName}-{item.givenName}-{item.birthDate}";

                if (uniquePatients.Contains(patientKey))
                {
                    continue;
                }
                uniquePatients.Add(patientKey);
                if (tmpId.Contains(item.id))
                {
                    var tmpPatientData = tmplist.FirstOrDefault(p => p.id == item.id);
                    if (tmpPatientData != null && tmpPatientData.familyName == item.familyName &&
                        tmpPatientData.givenName == item.givenName && tmpPatientData.birthDate == item.birthDate)
                    {
                        continue;
                    }
                    else
                    {
                        int newID = GetNewID(tmpId);
                        item.id = newID;
                    }
                }
                else
                {
                    tmpId.Add(item.id);
                }

                tmplist.Add(item);
            }

            tmplist = tmplist.OrderBy(p => p.id).ToList();
            for(int i = 0; i < tmplist.Count; i++)
            {
                tmplist[i].id = i;
            }

            return tmplist;
        }

        public List<GetDataPatient> CheckedPatientList(List<GetDataPatient> list)
        {
            List<GetDataPatient> tmplist = new List<GetDataPatient>();
            foreach (var item in list)
            {
                DateTime now = DateTime.Now;
                DateTime minData = now.AddYears(-150);
                bool isValidpatient = true;
                if (item.familyName != null && item.givenName != null && item.sex != null && item.parameters != null)
                {
                    //Console.WriteLine($"{item.sex.Length} = {item.sex}");
                    if (item.id < 0)
                    {
                        isValidpatient = false;
                    }
                    if(!Regex.IsMatch(item.familyName, @"^[a-zA-Z]+( [a-zA-Z]+)?$"))
                    {
                        isValidpatient = false;
                    }
                    if(!Regex.IsMatch(item.givenName, @"^[a-zA-Z]+( [a-zA-Z]+)?$"))
                    {
                        isValidpatient = false;
                    }
                    if(item.birthDate > now || item.birthDate < minData)
                    {
                        isValidpatient = false;
                    }
                    if(item.sex != "M" && item.sex != "F")
                    {
                        isValidpatient = false;
                    }
                    if (item.parameters.Count > 0)
                    {
                        foreach (var item1 in item.parameters)
                        {
                            if (item1.name == null)
                            {
                                isValidpatient = false;
                                break;
                            }
                        }
                    }
                    else
                    {
                        isValidpatient = false;
                    }
                }
                else
                {
                    isValidpatient = false;
                }
                if (isValidpatient)
                {
                    tmplist.Add(item);
                }
                //Console.WriteLine($"il Patient {item.givenName} è nato il  {item.birthDate}");
            }
            //Console.WriteLine($"il numero di pazienti filtrati ne check sono = {tmplist.Count}");
            return tmplist;
        }


        private int GetNewID(HashSet<int> id)
        {
            int newID = id.Max() + 1;
            while (id.Contains(newID))
            {
                newID++;
            }
            id.Add(newID);
            return newID;
        }
    }
}