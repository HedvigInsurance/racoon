import { Button, Flex, Loadable, ThirdLevelHeadline } from '@hedvig-ui'
import { useItemModels } from './index'
import styled from '@emotion/styled'
import { ItemModelFilterSkeleton } from './ItemModelFilterSkeleton'

const FilterContainer = styled.section`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const Title = styled(ThirdLevelHeadline)`
  padding-block: 0.75rem;
  margin: 0;
`

export const ItemModelTypeFilter = () => {
  const {
    itemModelTypes,
    toggleTypeInFilter,
    selectedTypes,
    loadingItemModelTypes: loading,
  } = useItemModels()

  return (
    <>
      <Flex align="center" gap="small">
        <Title>Types</Title>
        {!!selectedTypes.length && (
          <Button
            variant="tertiary"
            onClick={() =>
              selectedTypes.forEach((type) => toggleTypeInFilter(type))
            }
          >
            Clear filter
          </Button>
        )}
      </Flex>
      {loading ? (
        <Loadable loading={loading}>
          <ItemModelFilterSkeleton />
        </Loadable>
      ) : (
        <FilterContainer>
          {itemModelTypes.map((type) => {
            const { name, displayName } = type
            return (
              <Button
                key={name}
                variant={
                  selectedTypes.length > 0
                    ? selectedTypes.some((type) => type.name === name)
                      ? 'primary'
                      : 'secondary'
                    : 'secondary'
                }
                onClick={() => toggleTypeInFilter(type)}
              >
                {displayName}
              </Button>
            )
          })}
        </FilterContainer>
      )}
    </>
  )
}
