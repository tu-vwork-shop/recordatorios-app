import { useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"

export default function IndexPopup() {
  // useStorage maneja la lectura/escritura asíncrona de chrome.storage.local automáticamente
  const [recordatorios, setRecordatorios] = useStorage<string[]>("mis-recordatorios", [])
  const [texto, setTexto] = useState("")

  const agregarRecordatorio = () => {
    if (texto.trim() === "") return

    // Actualización basada en el estado previo para evitar cierres obsoletos
    setRecordatorios((prev = []) => [...prev, texto])
    setTexto("")
  }

  const borrarRecordatorio = (indexABorrar: number) => {
    setRecordatorios((prev = []) => prev.filter((_, i) => i !== indexABorrar))
  }

  return (
    <div style={{ padding: 16, width: 260, fontFamily: "sans-serif" }}>
      <h3 style={{ marginTop: 0 }}>Mis Recordatorios</h3>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="Ej. Revisar correo"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregarRecordatorio()}
          style={{ flex: 1, padding: 6 }}
        />
        <button onClick={agregarRecordatorio}>Agregar</button>
      </div>

      <ul style={{ paddingLeft: 20, margin: 0 }}>
        {!recordatorios || recordatorios.length === 0 ? (
          <p style={{ fontSize: 12, color: "#666" }}>No hay recordatorios.</p>
        ) : (
          recordatorios.map((item, index) => (
            <li key={index} style={{ marginBottom: 6 }}>
              <span>{item}</span>
              <button
                onClick={() => borrarRecordatorio(index)}
                style={{ marginLeft: 8, color: "red", border: "none", background: "none", cursor: "pointer" }}
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}