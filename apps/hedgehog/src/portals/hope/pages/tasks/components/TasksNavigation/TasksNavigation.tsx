import { ComponentProps } from 'react'
import { css } from './TasksNavigation.css'
import { TopBar } from '../TopBar/TopBar'
import { FilterBar } from '../FilterBar/FilterBar'
import { CheckInBar } from '../CheckInBar/CheckInBar'

export function TasksNavigation(props: ComponentProps<'div'>) {
  return <div {...props} className={css.TasksNavigation} />
}

TasksNavigation.TopBar = TopBar
TasksNavigation.FilterBar = FilterBar
TasksNavigation.CheckInBar = CheckInBar
