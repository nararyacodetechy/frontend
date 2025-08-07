'use client'

import { useEffect } from 'react'

type AlertType = 'alert' | 'confirm'

interface CustomAlertProps {
  isOpen: boolean
  type?: AlertType
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
}

export default function CustomAlert({
  isOpen,
  type = 'alert',
  title = 'Notification',
  message,
  confirmText = 'Sure',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}: CustomAlertProps) {

  useEffect(() => {
    // Prevent body scroll saat modal aktif
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
        <p className="text-gray-600 text-sm mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          {type === 'confirm' && (
            <button
              onClick={onCancel}
              className="px-4 py-1.5 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            {type === 'alert' ? 'OK' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
