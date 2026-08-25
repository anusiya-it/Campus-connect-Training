import { createContext, useCallback, useContext, useState } from 'react'

const ToastContext = createContext(null)

let idCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback((message, type = 'success') => {
    const id = ++idCounter
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 4000)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="position-fixed top-0 end-0 p-3"
        style={{ zIndex: 2000 }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast show align-items-center text-white border-0 mb-2 ${
              t.type === 'error' ? 'bg-danger' : 'bg-success'
            }`}
            role="alert"
          >
            <div className="d-flex">
              <div className="toast-body">
                <i className={`bi ${t.type === 'error' ? 'bi-exclamation-circle' : 'bi-check-circle'} me-2`}></i>
                {t.message}
              </div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => removeToast(t.id)}
              ></button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
