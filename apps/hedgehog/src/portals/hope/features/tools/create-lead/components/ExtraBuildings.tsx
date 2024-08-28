import styled from '@emotion/styled'
import { FC, Fragment, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Button,
  ButtonsGroup,
  convertEnumToTitle,
  Input,
  Select,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { ExtraBuildingType } from '../../../config/constants'

const GapWrapper = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1rem;
`

const ExtraBuilding: FC<{ buildingNumber: number }> = ({ buildingNumber }) => {
  const {
    formState: { errors },
    register,
  } = useFormContext()

  return (
    <Fragment>
      <ThirdLevelHeadline>{`Extra building ${
        buildingNumber + 1
      }`}</ThirdLevelHeadline>
      <GapWrapper>
        <Input
          type="number"
          label="Area (m²)"
          placeholder="25"
          errors={errors}
          {...register(`extraBuildings.${buildingNumber}.area`, {
            valueAsNumber: true,
            required: { value: true, message: 'Required' },
          })}
        />

        <Select
          {...register(`extraBuildings.${buildingNumber}.type`, {
            required: 'Required',
          })}
          label="Type of building"
          options={Object.entries(ExtraBuildingType).map(([key, value]) => ({
            value,
            text: convertEnumToTitle(key),
          }))}
          errors={errors}
        />

        <Select
          {...register(`extraBuildings.${buildingNumber}.hasWaterConnected`, {
            required: 'Required',
          })}
          label="Has water connected"
          options={[
            { value: 'yes', text: 'Yes' },
            { value: 'no', text: 'No' },
          ]}
          errors={errors}
        />
      </GapWrapper>
    </Fragment>
  )
}

const ExtraBuildings: FC = () => {
  const [extraBuildings, setExtraBuildings] = useState<number[]>([])
  const { unregister } = useFormContext()
  return (
    <div>
      {extraBuildings.length > 0 &&
        extraBuildings?.map((number: number) => (
          <ExtraBuilding buildingNumber={number} key={number} />
        ))}

      <div>
        <ButtonsGroup>
          <Button
            type="button"
            onClick={() =>
              setExtraBuildings((previous) => {
                if (previous.length === 0) {
                  return [0]
                }
                return [...previous, previous.length]
              })
            }
          >
            Add extra building
          </Button>
          {extraBuildings.length > 0 && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                unregister(`extrabuildings.${extraBuildings.length}`)
                setExtraBuildings((previous) => previous.slice(0, -1))
              }}
            >
              Remove last building
            </Button>
          )}
        </ButtonsGroup>
      </div>
    </div>
  )
}

export default ExtraBuildings
