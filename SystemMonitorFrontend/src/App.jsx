import { useEffect, useState } from 'react'
import * as signalR from '@microsoft/signalr'

// Importo i componenti necessari per disegnare il grafico
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function App() {
  // lo "stato" è una lista (array) di dati storici
  const [history, setHistory] = useState([])

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5019/monitorHub") // porta del backend alla quale agganciarsi 
      .withAutomaticReconnect()
      .build()

    connection.on("ReceiveMetrics", (cpuUsage, availableRam) => { // valori del backend da prendere
      // Creo un "punto" per il grafico con l'orario attuale
      const newDataPoint = {
        time: new Date().toLocaleTimeString(),
        cpu: cpuUsage,
        ram: availableRam
      }
      // Utilizzo una funzione interna prevHistory dove creiamo un array di dati nuovo 
      // e ci andiamo a caricare tutti i dati vecchi piu quelli nuovi 
      setHistory(prevHistory => { 
        const newHistory = [...prevHistory, newDataPoint]
        return newHistory.slice(-20) //mantengo solo gli ultimi 20 elementi per non far esplodere il grafico
      })
    })

    connection.start()
      .catch(err => console.error("Errore di connessione: ", err))

    return () => {
      connection.stop()
    }
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center', backgroundColor: '#1e1e1e', color: 'white', minHeight: '100vh' }}>
      <h2>System Monitor Dashboard</h2>
      
      {/* === GRAFICO DELLA CPU === */}
      <div style={{ width: '80%', height: '400px', margin: '0 auto', marginTop: '2rem', backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ color: '#4da6ff', marginBottom: '20px' }}>Utilizzo CPU (%)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}> {/*rende disponibile l'array a tutti i blocchi al suo interno */}
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#aaa" />
            <YAxis domain={[0, 100]} stroke="#aaa" tickFormatter={(value) => `${value}%`} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} 
                formatter={(value) => [`${Number(value).toFixed(1)} %`, 'CPU']}
            />
            <Line type="monotone" dataKey="cpu" stroke="#4da6ff" strokeWidth={3} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* === GRAFICO DELLA RAM === */}
      <div style={{ width: '80%', height: '300px', margin: '0 auto', backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ color: '#107c10', marginBottom: '20px' }}>RAM Libera</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="time" stroke="#aaa" />
            {/* La RAM ha numeri grandi, allarghiamo l'asse Y (width=80) e aggiungiamo 'MB' */}
            <YAxis stroke="#aaa" tickFormatter={(value) => `${value} MB`} width={80} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} 
              formatter={(value) => [`${value} MB`, 'RAM Libera']}
            />
            <Line type="monotone" dataKey="ram" stroke="#107c10" strokeWidth={3} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}

export default App