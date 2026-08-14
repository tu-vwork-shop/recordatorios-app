import { useState } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import "./style.css"

// Estructura moderna del recordatorio
interface Recordatorio {
  id: number
  texto: string
  completado: boolean
}

export default function IndexPopup() {
  // arreglo de objetos estructurados
  const [recordatorios, setRecordatorios] = useStorage<Recordatorio[]>("mis-recordatorios-v2", [])
  const [texto, setTexto] = useState("")

  const agregarRecordatorio = () => {
    if (texto.trim() === "") return

    const nuevo: Recordatorio = {
      id: Date.now(), // ID único para evitar problemas con duplicados
      texto: texto.trim(),
      completado: false
    }

    setRecordatorios((prev = []) => [...prev, nuevo])
    setTexto("")
  }

  const borrarRecordatorio = (idABorrar: number) => {
    setRecordatorios((prev = []) => prev.filter((item) => item.id !== idABorrar))
  }

  //Estado completado/pendiente
  const alternarCompletado = (id: number) => {
    setRecordatorios((prev = []) =>
      prev.map((item) =>
        item.id === id ? { ...item, completado: !item.completado } : item
      )
    )
  }

  // Borrar todos los recordatorios limpiando el storage
  const borrarTodos = () => {
    if (window.confirm("¿Seguro que quieres borrar todos los recordatorios?")) {
      setRecordatorios([])
    }
  }

  return (
    <div className="popup-container">
      <h3 className="popup-title">Mis Recordatorios</h3>

      <div className="input-group">
        <input
          type="text"
          placeholder="Ej. Revisar correo..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && agregarRecordatorio()}
          className="input-field"
        />
        <button onClick={agregarRecordatorio} className="btn-add">
          Agregar
        </button>
      </div>

      <ul className="reminder-list">
        {!recordatorios || recordatorios.length === 0 ? (
          <p className="empty-message">No hay recordatorios pendientes.</p>
        ) : (
          recordatorios.map((item) => (
            <li key={item.id} className={`reminder-item ${item.completado ? "is-completed" : ""}`}>
              <div className="reminder-content" onClick={() => alternarCompletado(item.id)}>
                {/* Checkbox visual e interactivo */}
                <span className="reminder-checkbox"></span>
                <span className="reminder-text">{item.texto}</span>
              </div>
              <button
                onClick={() => borrarRecordatorio(item.id)}
                className="btn-delete"
                title="Eliminar"
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Botón para borrar todo si hay elementos en la lista */}
      {recordatorios && recordatorios.length > 0 && (
        <button onClick={borrarTodos} className="btn-clear-all">
          Borrar todos los recordatorios
        </button>
      )}
    </div>
  )
}
