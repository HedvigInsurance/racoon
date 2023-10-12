import { atom, useAtom, useAtomValue } from 'jotai'
import { useTranslation } from 'next-i18next'
import { CampaignIcon, Text, theme } from 'ui'
import { ToggleCard } from '@/components/ToggleCard/ToggleCard'

export const ExtensionOfferToggle = () => {
  const { t } = useTranslation('carDealership')
  const [userWantsExtension, setUserWantsExtension] = useSetUserWantsExtension()

  return (
    <ToggleCard
      label={t('TOGGLE_EXTENSION_LABEL')}
      defaultChecked={userWantsExtension}
      onCheckedChange={setUserWantsExtension}
      Icon={<CampaignIcon size="1rem" color={theme.colors.signalGreenElement} />}
    >
      <Text as="p" color="textTranslucentSecondary" size="xs">
        {t('TOGGLE_EXTENSION_DESCRIPTION')}
      </Text>
    </ToggleCard>
  )
}

const ATOM = atom(true)

const useSetUserWantsExtension = () => {
  return useAtom(ATOM)
}

export const useUserWantsExtension = () => {
  return useAtomValue(ATOM)
}
