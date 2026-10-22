using SystemMonitorBackend.Services;
using SystemMonitorBackend.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Autorizziamo React (che girerà sulla porta 5173) a connettersi al nostro server C#
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // La porta standard di React
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // WebSockets (SignalR)
    });
});

// Registra il tuo servizio in modo che giri in background
builder.Services.AddSignalR();
builder.Services.AddHostedService<MetricsCollectorService>();

var app = builder.Build();

// Attivo la regola creata sopra 
app.UseCors("AllowReact");

// Creo l'indirizzo a cui React dovrà connettersi
app.MapHub<MonitorHub>("/monitorHub");

app.Run();