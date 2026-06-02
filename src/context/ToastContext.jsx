import { useCallback, useState } from 'react'
import { ToastContext } from './toastState'

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, variant = 'success', duration = 3000) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-item toast-item-${toast.variant}`}>
            <span className="material-symbols-outlined toast-icon">
              {toast.variant === 'success' ? 'check_circle' : toast.variant === 'danger' ? 'error' : 'info'}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button
              type="button"
              className="toast-close"
              onClick={() => dismissToast(toast.id)}
              aria-label="Đóng"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
