using System.Linq;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.Net.Http.Headers;
using GetIPAData.Services;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
//using RazorPagesContacts.Data;

/*  comando powerShell per controllare endpoint per ottenere la richiesta API
    $auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("test:TestMePlease!"))
    Invoke-WebRequest -Uri "https://mobile.digistat.it/CandidateApi/Patient/GetList" `
    -Headers @{Authorization=("Basic " + $auth)} `
    -Method Get
*/

namespace AscomWebApp;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Aggiungo i servizzi necessari per MCV e Razor Pages
        builder.Services.AddControllersWithViews(); 
        builder.Services.AddHttpClient<PatientService>();
        builder.Services.AddRazorPages();

        var app = builder.Build();
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage(); // Mostra la pagina di errore in modalità sviluppo
        }
        else
        {
            app.UseExceptionHandler("/Home/Error");
            app.UseHsts(); // Abilita gli header HSTS
        }

        app.UseHttpsRedirection();
        app.UseWebSockets();
        // Per servire file statici come CSS, ecc...
        app.UseStaticFiles();  
        // Per abilitare il routing
        app.UseRouting();


        // Configura i controller e le Razor Pages come endpoint
        app.MapControllerRoute(name: "default", pattern: "{controller=Home}/{action=Index}/{id?}");


        // Aggiungo anche la route predefinita per l'MVC
        //app.MapDefaultControllerRoute();

        using (var serviceScope = app.Services.CreateScope())
        {
            var patientService = serviceScope.ServiceProvider.GetRequiredService<PatientService>();
            var patientsList = await patientService.GetPatientsAsync();

            //if (patientsList != null && patientsList.Count > 0)
            //{
            //    Console.WriteLine("Lista pazienti ottenuta !!!");
            //    foreach (var patient in patientsList)
            //    {
            //        foreach (var item in patient.parameters)
            //        {
            //            Console.WriteLine($"ID: {item.id}, Nome: {item.name}, Value: {item.value}, Alarm: {item.alarm}");
            //        }
            //    }
            //}
            //else
            //{
            //    Console.WriteLine("Non ci sono pazienti disponibili.");
            //}
        }

        app.MapGet("/", (HttpContext context) =>
        {
            context.Response.Redirect("/Home");
            return Task.CompletedTask;
        });

        app.Run();
    }
}
