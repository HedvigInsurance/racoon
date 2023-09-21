import { datadogRum } from '@datadog/browser-rum'
import { type ComponentProps } from 'react'
import { Space, Button, RestartIcon } from 'ui'
import { SpaceFlex } from '@/components/SpaceFlex/SpaceFlex'
import { ProductItemContractContainerCar } from './ProductItemContractContainer'

type Props = Pick<ComponentProps<typeof ProductItemContractContainerCar>, 'contract'>

export const TrialExtensionForm = (props: Props) => {
  const handleUndo = () => {
    datadogRum.addAction('Car dealership | Undo extension removal')
  }

  return (
    <Space y={2}>
      <Space y={1}>
        <ProductItemContractContainerCar contract={props.contract} />
        <Button variant="secondary" onClick={handleUndo}>
          <SpaceFlex direction="horizontal" space={0.5}>
            <RestartIcon />
            Ångra borttagning
          </SpaceFlex>
        </Button>
      </Space>
      <Button variant="primary">Koppla betalning i appen</Button>
    </Space>
  )
}
