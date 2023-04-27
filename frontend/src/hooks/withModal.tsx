import { Modal } from '@admiral-ds/react-ui'
import { ComponentType, useState } from 'react'

export type ModalProps = {
  handleOpenModal: () => void
  handleCloseModal: () => void
}

export type WithModalProps<T> = T & ModalProps

export const withModal =
  <T extends object>(ComponentHandler: ComponentType<WithModalProps<T>>) =>
  (ModalContent: ComponentType<ModalProps & T>) =>
    function useModal(props?: T) {
      const [open, setOpen] = useState<boolean>(false)

      const handleOpen = () => setOpen(true)

      const handleClose = () => setOpen(false)

      if (open) {
        return (
          <>
            <ComponentHandler handleOpenModal={handleOpen} handleCloseModal={handleClose} {...(props as T)} />
            <Modal
              onClose={handleClose}
              style={{
                width: 'auto'
              }}
            >
              <ModalContent handleOpenModal={handleOpen} handleCloseModal={handleClose} {...(props as T)} />
            </Modal>
          </>
        )
      }

      return <ComponentHandler handleOpenModal={handleOpen} handleCloseModal={handleClose} {...(props as T)} />
    }
