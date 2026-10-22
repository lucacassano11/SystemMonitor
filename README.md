# 📊 Real-Time System Monitor

Un'applicazione full-stack per il monitoraggio in tempo reale delle risorse di sistema (CPU e RAM).

## 🛠️ Tech Stack

* **Backend:** C# (.NET 8 Web API), SignalR (WebSockets), `System.Diagnostics`
* **Frontend:** React (Vite), Recharts, `@microsoft/signalr`

## ✨ Funzionalità

* Lettura hardware in tempo reale tramite contatori di prestazioni Windows.
* Trasmissione dati a bassa latenza tramite WebSockets con SignalR.
* Dashboard reattiva con grafici a linee e storico dinamico degli ultimi 20 secondi.
* Architettura completamente disaccoppiata (C# Backend + React Frontend).

## 🚀 Come eseguire il progetto

1. **Avviare il Backend (C#):**
   ```bash
   cd SystemMonitorBackend
   dotnet run
