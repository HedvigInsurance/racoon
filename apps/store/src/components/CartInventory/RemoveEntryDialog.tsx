import { motion, type Transition } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import { FormEventHandler, ReactNode, useId } from 'react'
import { Button, Text, theme } from 'ui'
import * as FullscreenDialog from '@/components/FullscreenDialog/FullscreenDialog'
import { CartFragmentFragment } from '@/services/apollo/generated'
import { CartEntry } from './CartInventory.types'
import { useRemoveCartEntry } from './useRemoveCartEntry'

type Props = CartEntry & {
  shopSessionId: string
  children: ReactNode
  onCompleted?: (cart: CartFragmentFragment) => void
}

export const RemoveEntryDialog = ({ children, title, ...mutationParams }: Props) => {
  const { t } = useTranslation('cart')
  const formId = useId()

  const [removeCartEntry, { loading }] = useRemoveCartEntry(mutationParams)

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault()
    removeCartEntry()
  }

  return (
    <FullscreenDialog.Root>
      {children}

      <FullscreenDialog.Modal
        center={true}
        Footer={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={ANIMATE_TRANSITION}
          >
            <Button form={formId} type="submit" loading={loading} disabled={loading}>
              {t('REMOVE_ENTRY_MODAL_CONFIRM_BUTTON')}
            </Button>
            <FullscreenDialog.Close asChild={true}>
              <Button type="button" variant="ghost">
                {t('REMOVE_ENTRY_MODAL_CANCEL_BUTTON')}
              </Button>
            </FullscreenDialog.Close>
          </motion.div>
        }
      >
        <motion.div
          initial={{
            opacity: 0,
            y: '20%',
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={ANIMATE_TRANSITION}
        >
          <form id={formId} onSubmit={handleSubmit} />
          <Text size={{ _: 'md', lg: 'xl' }} align="center">
            {t('REMOVE_ENTRY_MODAL_PROMPT', { name: title })}
          </Text>
        </motion.div>
      </FullscreenDialog.Modal>
    </FullscreenDialog.Root>
  )
}

const ANIMATE_TRANSITION: Transition = {
  duration: 0.6,
  delay: 0.3,
  ...theme.transitions.framer.easeInOutCubic,
}
