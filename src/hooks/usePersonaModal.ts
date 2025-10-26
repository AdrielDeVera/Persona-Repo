import { useEffect, useState } from 'react'

export function usePersonaModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('persona-modal-open')
      // Add a custom CSS class to override Persona's modal styles
      document.body.classList.add('persona-modal-active')
    } else {
      document.body.classList.remove('persona-modal-open')
      document.body.classList.remove('persona-modal-active')
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('persona-modal-open')
      document.body.classList.remove('persona-modal-active')
    }
  }, [isModalOpen])

  return {
    isModalOpen,
    setIsModalOpen
  }
}
