import { atom, useAtom, useAtomValue } from 'jotai'
import { useTranslation } from 'next-i18next'
import { CampaignIcon, sprinkles, theme, ToggleCard } from 'ui'

export const ExtensionOfferToggle = () => {
  const { t } = useTranslation('carDealership')
  const [userWantsExtension, setUserWantsExtension] = useSetUserWantsExtension()

  return (
    <ToggleCard.Root>
      <ToggleCard.Label
        pre={
          <CampaignIcon
            size="1rem"
            color={theme.colors.signalGreenElement}
            className={sprinkles({ mr: 'xxs' })}
          />
        }
      >
        {t('TOGGLE_EXTENSION_LABEL')}
      </ToggleCard.Label>
      <ToggleCard.Switch
        defaultChecked={userWantsExtension}
        onCheckedChange={setUserWantsExtension}
      />

      <ToggleCard.Description>{t('TOGGLE_EXTENSION_DESCRIPTION')}</ToggleCard.Description>
    </ToggleCard.Root>
  )
}

const ATOM = atom(true)

const useSetUserWantsExtension = () => {
  return useAtom(ATOM)
}

export const useUserWantsExtension = () => {
  return useAtomValue(ATOM)
}
