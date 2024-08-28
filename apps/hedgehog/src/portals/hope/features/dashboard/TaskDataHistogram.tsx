import {
  TaskDashboardDataFragment,
  TaskResourceArea,
  TaskWarmth,
} from 'types/generated/graphql'
import styled from '@emotion/styled'
import {
  convertEnumToTitle,
  Spacing,
  ThirdLevelHeadline,
  Popover,
  useLocalStorage,
  Flex,
} from '@hedvig-ui'
import {
  MarketFlags,
  Market,
  WarmthEmoji,
} from '@hope/features/config/constants'
import { parseISO, differenceInHours } from 'date-fns'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import chroma from 'chroma-js'
import {
  TaskResourceAreaIcon,
  TaskResourceAreaName,
  TaskResourceAreas,
} from '@hope/features/tasks/constants'

const FilterButtons = styled.div`
  width: max-content;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5em;
`

const FilterBox = styled.div`
  font-size: ${({ theme }) => theme.fontSize.medium};
  max-width: 20rem;
  display: flex;
  gap: 0.5em;
  padding: 0.3rem 0.5rem 0.3rem 0.5rem;
  background-color: ${({ theme }) => theme.accentLighter};
  :hover {
    background-color: ${({ theme }) => chroma(theme.accentLight).hex()};
  }
  margin: 0 0 0.3em 0;
  border-radius: 3px;
  font-size: ${({ theme }) => theme.fontSize.small};

  cursor: pointer;
  &.selected {
    background-color: ${({ theme }) => theme.accent};
    :hover {
      background-color: ${({ theme }) =>
        chroma(theme.accent).brighten(0.8).hex()};
    }
  }
`
const ClearFilterButton = styled(FilterBox)`
  cursor: pointer;
  &.disable {
    opacity: 0.7;
    pointer-events: none;
  }
`

const FilterBoxNumber = styled.div`
  background-color: white;
  width: 1.8rem;
  text-align: center;
  border-radius: 3px;
`

const FilterBoxIcon = styled.div``

interface TasksDataProps {
  tasks: ReadonlyArray<TaskDashboardDataFragment>
}

type AreaOrNull = TaskResourceArea | null

export const TaskDataHistogram = ({ tasks }: TasksDataProps) => {
  const [selectedAreas, setSelectedAreas] = useLocalStorage<AreaOrNull[]>(
    'DashboardSelectedAreas',
    [],
  )
  const [selectedMarkets, setSelectedMarkets] = useLocalStorage<string[]>(
    'DashboardSelectedMarkets',
    [],
  )
  const [selectedWarmth, setSelectedWarmth] = useLocalStorage<string[]>(
    'DashboardSelectedWarmth',
    [],
  )

  const filteredTasksByMarket =
    selectedMarkets.length === 0
      ? tasks
      : tasks.filter((task) =>
          selectedMarkets.includes(task.market ?? 'UNSPECIFIED'),
        )

  const filteredTasksByWarmth =
    selectedWarmth.length === 0
      ? filteredTasksByMarket
      : filteredTasksByMarket.filter((task) =>
          selectedWarmth.includes(task.warmth ?? null),
        )

  const filteredTasks =
    selectedAreas.length === 0
      ? filteredTasksByWarmth
      : filteredTasksByWarmth.filter((task) =>
          selectedAreas.includes(task.area ?? null),
        )

  const marketCount = tasks.reduce(
    (marketGroup, task) => {
      const markets = (task.market as Market) ?? 'UNSPECIFIED'
      if (marketGroup[markets]) {
        marketGroup[markets]++
      } else {
        marketGroup[markets] = 1
      }
      return marketGroup
    },
    {} as Record<Market | 'UNSPECIFIED', number>,
  )

  const warmthCount = filteredTasksByMarket.reduce(
    (warmthGroup, task) => {
      const warmths = task.warmth ?? 'UNSPECIFIED'
      if (warmthGroup[warmths]) {
        warmthGroup[warmths]++
      } else {
        warmthGroup[warmths] = 1
      }
      return warmthGroup
    },
    {} as Record<TaskWarmth | 'UNSPECIFIED', number>,
  )

  const areaCount = filteredTasksByMarket.reduce(
    (areaGroup, task) => {
      const areas = task.area ?? 'UNSPECIFIED'
      if (areaGroup[areas]) {
        areaGroup[areas]++
      } else {
        areaGroup[areas] = 1
      }
      return areaGroup
    },
    {} as Record<TaskResourceArea | 'UNSPECIFIED', number>,
  )

  const bins = Array(49).fill(0)

  const now = new Date()
  filteredTasks.forEach((task) => {
    const createdAt = parseISO(task.createdAt)
    const hoursAgo = differenceInHours(now, createdAt)
    const binIndex = Math.min(hoursAgo, bins.length - 1)
    bins[binIndex] = bins[binIndex] + 1
  })

  const data = bins.map((n, index) => ({
    Tasks: n,
    Hours: index === bins.length - 1 ? `${bins.length - 1}+` : index,
  }))

  return (
    <div>
      <Spacing top="medium" />
      <Flex gap="small" wrap="wrap">
        <div>
          <ThirdLevelHeadline> Filtered by Warmth</ThirdLevelHeadline>
          <FilterButtons>
            {Object.values(TaskWarmth).map((warmth) => {
              return (
                <Popover
                  key={warmth}
                  contents={warmth ? convertEnumToTitle(warmth) : 'none'}
                >
                  <FilterBox
                    className={
                      selectedWarmth.includes(warmth) ? 'selected' : ''
                    }
                    onClick={() =>
                      setSelectedWarmth((prev) =>
                        prev.includes(warmth)
                          ? prev.filter((value) => value !== warmth)
                          : [...selectedWarmth, warmth],
                      )
                    }
                    key={warmth ?? 'null'}
                  >
                    <FilterBoxIcon>{WarmthEmoji[warmth]}</FilterBoxIcon>
                    <FilterBoxNumber>
                      {warmthCount[warmth ?? 'UNSPECIFIED'] ?? 0}
                    </FilterBoxNumber>
                  </FilterBox>
                </Popover>
              )
            })}
            {warmthCount.UNSPECIFIED > 0 && (
              <Popover key={'UNSPECIFIED'} contents={'none'}>
                <FilterBox
                  className={
                    selectedWarmth.includes('UNSPECIFIED') ? 'selected' : ''
                  }
                  onClick={() =>
                    setSelectedWarmth((prev) =>
                      prev.includes('UNSPECIFIED')
                        ? prev.filter((value) => value !== 'UNSPECIFIED')
                        : [...selectedWarmth, 'UNSPECIFIED'],
                    )
                  }
                  key={'UNSPECIFIED'}
                >
                  <FilterBoxIcon>🏳️</FilterBoxIcon>
                  <FilterBoxNumber>{marketCount.UNSPECIFIED}</FilterBoxNumber>
                </FilterBox>
              </Popover>
            )}
            <Popover
              contents={
                selectedWarmth.length === 0 ? 'Filter is empty' : 'Clear filter'
              }
            >
              <ClearFilterButton
                className={selectedWarmth.length === 0 ? 'disable' : ''}
                onClick={() => setSelectedWarmth([])}
              >
                Clear filter
              </ClearFilterButton>
            </Popover>
          </FilterButtons>
        </div>
        <div>
          <ThirdLevelHeadline> Filtered by Markets</ThirdLevelHeadline>
          <FilterButtons>
            {Object.values(Market).map((market) => {
              return (
                <Popover
                  key={market}
                  contents={market ? convertEnumToTitle(market) : 'none'}
                >
                  <FilterBox
                    className={
                      selectedMarkets.includes(market) ? 'selected' : ''
                    }
                    onClick={() =>
                      setSelectedMarkets((prev) =>
                        prev.includes(market)
                          ? prev.filter((value) => value !== market)
                          : [...selectedMarkets, market],
                      )
                    }
                    key={market ?? 'null'}
                  >
                    <FilterBoxIcon>{MarketFlags[market]}</FilterBoxIcon>
                    <FilterBoxNumber>
                      {marketCount[market ?? 'UNSPECIFIED'] ?? 0}
                    </FilterBoxNumber>
                  </FilterBox>
                </Popover>
              )
            })}
            {marketCount.UNSPECIFIED > 0 && (
              <Popover key={'UNSPECIFIED'} contents={'none'}>
                <FilterBox
                  className={
                    selectedMarkets.includes('UNSPECIFIED') ? 'selected' : ''
                  }
                  onClick={() =>
                    setSelectedMarkets((prev) =>
                      prev.includes('UNSPECIFIED')
                        ? prev.filter((value) => value !== 'UNSPECIFIED')
                        : [...selectedMarkets, 'UNSPECIFIED'],
                    )
                  }
                  key={'UNSPECIFIED'}
                >
                  <FilterBoxIcon>🏳️</FilterBoxIcon>
                  <FilterBoxNumber>{marketCount.UNSPECIFIED}</FilterBoxNumber>
                </FilterBox>
              </Popover>
            )}
            <Popover
              contents={
                selectedMarkets.length === 0
                  ? 'Filter is empty'
                  : 'Clear filter'
              }
            >
              <ClearFilterButton
                className={selectedMarkets.length === 0 ? 'disable' : ''}
                onClick={() => setSelectedMarkets([])}
              >
                Clear filter
              </ClearFilterButton>
            </Popover>
          </FilterButtons>
        </div>
        <div>
          <ThirdLevelHeadline> Filtered by Areas</ThirdLevelHeadline>
          <FilterButtons>
            {[...TaskResourceAreas, null].map((area) => {
              const filterBoxArea = area?.value ?? null
              return (
                <Popover
                  contents={
                    area?.value ? TaskResourceAreaName[area.value] : 'none'
                  }
                  key={filterBoxArea}
                >
                  <FilterBox
                    className={
                      selectedAreas.includes(filterBoxArea) ? 'selected' : ''
                    }
                    onClick={() =>
                      setSelectedAreas((prev) =>
                        prev.includes(filterBoxArea)
                          ? prev.filter((value) => value !== filterBoxArea)
                          : [...selectedAreas, filterBoxArea],
                      )
                    }
                    key={area?.value ?? 'null'}
                  >
                    <FilterBoxIcon>
                      {area?.value ? TaskResourceAreaIcon[area.value] : '📬'}
                    </FilterBoxIcon>
                    <FilterBoxNumber>
                      {areaCount[area?.value ?? 'UNSPECIFIED'] ?? 0}
                    </FilterBoxNumber>
                  </FilterBox>
                </Popover>
              )
            })}
            <Popover
              contents={
                selectedAreas.length === 0 ? 'Filter is empty' : 'Clear filter'
              }
            >
              <ClearFilterButton
                className={selectedAreas.length === 0 ? 'disable' : ''}
                onClick={() => setSelectedAreas([])}
              >
                Clear filter
              </ClearFilterButton>
            </Popover>
          </FilterButtons>
        </div>
      </Flex>
      <ThirdLevelHeadline>
        Task waiting time within area and market
      </ThirdLevelHeadline>
      <ResponsiveContainer width={'80%'} height={300}>
        <BarChart data={data} width={800} height={300}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Hours" label={{ value: 'Hours', dy: 14 }} />
          <YAxis
            label={{
              value: 'Number of tasks',
              angle: -90,
              dx: -15,
            }}
          />
          <Bar dataKey="Tasks" fill="#36658f" />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
      <Spacing />
    </div>
  )
}
