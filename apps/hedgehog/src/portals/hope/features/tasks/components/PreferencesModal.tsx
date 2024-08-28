import { motion } from 'framer-motion'
import { Market, MarketFlags } from '@hope/features/config/constants'
import {
  TaskResourceAreaIcon,
  TaskResourceAreaName,
  TaskResourceAreas,
} from '@hope/features/tasks/constants'
import { useMe } from '@hope/features/user/hooks/use-me'
import { useMemo } from 'react'
import * as React from 'react'
import {
  Button,
  ButtonsGroup,
  convertEnumToTitle,
  Flex,
  FourthLevelHeadline,
  Modal,
  Paragraph,
  SecondLevelHeadline,
} from '@hedvig-ui'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import { TaskResourceArea, TaskResourceType } from 'types/generated/graphql'

const Container = styled(Modal)`
  width: 70rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  padding: 1.5rem 1.5rem 5rem;

  h4 {
    font-size: 1.4rem;
  }

  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.semiStrongForeground};
  }

  .tip {
    margin-top: 0.5rem;
    margin-bottom: -0.5rem;
    font-size: 0.8rem;
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1).hex()};
    text-align: center;
  }
`

const FilterButton = styled(motion.button, {
  shouldForwardProp: (propName) => propName !== 'partiallySelected',
})<{
  selected: boolean
  partiallySelected?: boolean
  small?: boolean
}>`
  border: none;
  display: inline-flex;
  background-color: ${({ theme, selected, partiallySelected }) =>
    partiallySelected
      ? theme.accentLight
      : selected
        ? theme.accent
        : theme.backgroundTransparent};
  padding: ${({ small }) => (!small ? '0.4em 0.7em' : '0.3em 0.6em')};
  border-radius: 6px;
  transition: all 50ms;
  cursor: pointer;
  align-items: center;
  color: ${({ theme, selected, partiallySelected }) =>
    partiallySelected
      ? theme.accent
      : selected
        ? theme.accentContrast
        : theme.semiStrongForeground};
  font-family: inherit;
  font-size: ${({ small }) => (!small ? '16px' : '14px')};

  :hover {
    background-color: ${({ theme, selected, partiallySelected }) =>
      partiallySelected
        ? theme.accent
        : selected
          ? theme.accent
          : theme.accentLight};
    color: ${({ theme, selected, partiallySelected }) =>
      partiallySelected
        ? theme.accentContrast
        : selected
          ? theme.accentLight
          : theme.accent};
  }
`

export const PreferencesModal: React.FC<{
  onClose: () => void
  visible: boolean
}> = ({ onClose, visible }) => {
  const {
    me,
    update,
    resetUserUpdates,
    saveUserUpdates,
    markets,
    resources,
    areas,
  } = useMe()

  const hasChangedSettings = useMemo(
    () =>
      me.markets.length !== markets.length ||
      !markets.every((market) => me.markets.includes(market as Market)) ||
      me.resources.length !== resources.length ||
      !resources.every((resource) => me.resources.includes(resource)) ||
      me.areas.length !== areas.length ||
      !areas.every((area) => me.areas.includes(area)),
    [me, markets, resources, areas],
  )

  const parentAreas = useMemo(
    () =>
      [...TaskResourceAreas].reduce(
        (parentAreas, area) => {
          const isRelevantParent =
            areas.includes(area.value) ||
            areas.some(
              (potentialChild) =>
                area.value &&
                [...TaskResourceAreas].find(
                  ({ value }) => value === potentialChild,
                )?.parent === area.value,
            )
          if (!isRelevantParent) {
            return parentAreas
          }
          const children = [...TaskResourceAreas]
            .filter(({ parent }) => parent === area.value)
            .map(({ value }) => value)

          if (children.length) {
            parentAreas[area.value] = children
          }
          return parentAreas
        },
        {} as Record<TaskResourceArea, TaskResourceArea[]>,
      ),
    [areas],
  )
  return (
    <Container
      onClose={() => {
        resetUserUpdates()
        onClose()
      }}
      visible={visible}
    >
      <div>
        <SecondLevelHeadline>Select preferences</SecondLevelHeadline>
        <Paragraph>
          You will only be assigned members compatible with your preferences
        </Paragraph>
      </div>
      <Flex
        gap="small"
        direction="column"
        style={{ width: '100%', margin: '0 auto' }}
      >
        <Flex gap="small">
          <FourthLevelHeadline>Market:</FourthLevelHeadline>
          <Flex gap="small" justify="flex-end">
            {Object.values(Market).map((market) => (
              <FilterButton
                key={market}
                selected={markets.includes(market)}
                onClick={() => {
                  update(market, null, null)
                }}
              >
                {convertEnumToTitle(market)} {MarketFlags[market]}
              </FilterButton>
            ))}
          </Flex>
        </Flex>
        <Flex gap="small" justify="center">
          <FourthLevelHeadline>Type:</FourthLevelHeadline>
          <Flex gap="small" justify="flex-end">
            {Object.values(TaskResourceType).map((resource) => (
              <FilterButton
                key={resource}
                selected={resources.includes(resource)}
                onClick={() => {
                  update(null, resource, null)
                }}
              >
                {convertEnumToTitle(resource)}s
                {resource === TaskResourceType.Claim &&
                  ' (Questions on open claim)'}
                {resource === TaskResourceType.StaleClaim && ' (45 days)'}
              </FilterButton>
            ))}
          </Flex>
        </Flex>
        <Flex gap="small" justify="center">
          <FourthLevelHeadline>Area:</FourthLevelHeadline>
          <Flex gap="small" justify="flex-end" style={{ flexWrap: 'wrap' }}>
            {[...TaskResourceAreas].map((area) => {
              const hasChildren = [...TaskResourceAreas].some(
                (potentialChild) => potentialChild.parent === area.value,
              )
              const hasSelectedChild = areas.some(
                (potentialChild) =>
                  [...TaskResourceAreas].find(
                    ({ value }) => value === potentialChild,
                  )?.parent === area.value,
              )
              const selected = areas.includes(area.value)
              const partiallySelected =
                hasSelectedChild || (selected && hasChildren)
              if (area.parent) return null
              return (
                <FilterButton
                  key={area.value}
                  partiallySelected={partiallySelected}
                  selected={selected}
                  onClick={() => {
                    const children = [...TaskResourceAreas]
                      .filter(({ parent }) => parent === area.value)
                      .map(({ value }) => value)
                    update(
                      null,
                      null,
                      partiallySelected || selected
                        ? areas.filter(
                            (current) =>
                              area.value !== current &&
                              (current == null || !children.includes(current)),
                          )
                        : [...areas, area.value],
                    )
                  }}
                >
                  {TaskResourceAreaName[area.value]}{' '}
                  {TaskResourceAreaIcon[area.value]}
                </FilterButton>
              )
            })}
            <FilterButton
              selected={areas.includes(null)}
              onClick={() => {
                update(
                  null,
                  null,
                  areas.includes(null)
                    ? areas.filter((current) => current !== null)
                    : [...areas, null],
                )
              }}
            >
              {'None'} {'📬'}
            </FilterButton>
          </Flex>
        </Flex>

        {Object.entries(parentAreas).map(([key, children]) => {
          const parent = key as TaskResourceArea
          return (
            <Flex key={key} gap="small" justify="center">
              <FourthLevelHeadline>
                {TaskResourceAreaIcon[parent]} {TaskResourceAreaName[parent]}:
              </FourthLevelHeadline>
              <Flex gap="small" justify="flex-end" style={{ flexWrap: 'wrap' }}>
                <FilterButton
                  key={parent}
                  selected={areas.includes(parent)}
                  onClick={() => {
                    update(
                      null,
                      null,
                      areas.includes(parent)
                        ? areas.filter((current) => parent !== current)
                        : [
                            ...areas.filter((current) => parent !== current),
                            parent,
                          ],
                    )
                  }}
                >
                  {TaskResourceAreaName[parent]} {TaskResourceAreaIcon[parent]}
                </FilterButton>
                {children.map((area) => (
                  <FilterButton
                    key={area}
                    selected={areas.includes(area)}
                    onClick={() => {
                      update(
                        null,
                        null,
                        areas.includes(area)
                          ? areas.filter((current) => area !== current)
                          : [...areas, area],
                      )
                    }}
                  >
                    {TaskResourceAreaName[area]} {TaskResourceAreaIcon[area]}
                  </FilterButton>
                ))}
              </Flex>
            </Flex>
          )
        })}

        <ButtonsGroup style={{ justifyContent: 'flex-end' }}>
          <Button
            disabled={!hasChangedSettings}
            status="success"
            onClick={() => saveUserUpdates()}
          >
            Save updates
          </Button>
          <Button
            variant="tertiary"
            onClick={() => {
              resetUserUpdates()
              if (!hasChangedSettings) {
                onClose()
              }
            }}
          >
            Cancel
          </Button>
        </ButtonsGroup>
      </Flex>
    </Container>
  )
}
