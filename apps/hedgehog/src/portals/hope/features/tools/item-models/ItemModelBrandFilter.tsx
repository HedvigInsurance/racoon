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
export const ItemModelBrandFilter = () => {
  const {
    itemModelBrands,
    toggleBrandInFilter,
    selectableBrands,
    selectedBrands,
    loadingItemModelTypes: loading,
  } = useItemModels()
  return (
    <>
      <Flex align="center" gap="small">
        <Title>Brands</Title>
        {!!selectedBrands.length && (
          <Button
            variant="tertiary"
            onClick={() =>
              selectedBrands.forEach((brand) => toggleBrandInFilter(brand))
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
          {itemModelBrands.map(({ name, displayName }) => (
            <Button
              key={name}
              variant={
                selectedBrands.length > 0
                  ? selectedBrands.find((brand) => brand.name === name)
                    ? 'primary'
                    : 'secondary'
                  : 'secondary'
              }
              disabled={!selectableBrands.find((brand) => brand.name === name)}
              onClick={() => toggleBrandInFilter({ name, displayName })}
            >
              {displayName}
            </Button>
          ))}
        </FilterContainer>
      )}
    </>
  )
}
