import {
  DefaultToastItem,
  NotificationStatus,
  ToastItemWithAutoDelete,
  ToastItemWithProgress,
  useToast
} from '@admiral-ds/react-ui'
import { ReactNode } from 'react'

type NotificationProps = {
  status?: NotificationStatus
  message: string
  onClose?: () => void
  isProgress?: boolean
  /**
   * When isProgress equals true
   */
  deleteTime?: number
}

type NotificationContainerProps = {
  children?: ReactNode
}

export const useNotification = () => {
  const { addToastItem, removeToastItem, autoDeleteTime } = useToast()

  return ({ status = 'info', message, onClose, deleteTime, isProgress = false }: NotificationProps) => {
    const renderToast = () => {
      const handleOnClose = () => {
        onClose && onClose()
        removeToastItem({ id: 'create-linked-task-toast-error', renderToast })
      }

      const Container = ({ children }: NotificationContainerProps) => {
        if (isProgress) {
          return (
            <ToastItemWithProgress onRemoveNotification={handleOnClose} autoDeleteTime={deleteTime ?? autoDeleteTime}>
              {children}
            </ToastItemWithProgress>
          )
        }

        return (
          <ToastItemWithAutoDelete onRemoveNotification={handleOnClose} autoDeleteTime={autoDeleteTime}>
            {children}
          </ToastItemWithAutoDelete>
        )
      }

      return (
        <Container>
          <DefaultToastItem status={status} onClose={handleOnClose}>
            {message}
          </DefaultToastItem>
        </Container>
      )
    }

    addToastItem({ id: 'toast', renderToast })
  }
}
