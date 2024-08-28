import { TaskResourceArea, TaskResourceType } from 'types/generated/graphql'

const APPLICABLE_TASK_TYPES = {
  [TaskResourceType.Claim]: [TaskResourceType.Claim, TaskResourceType.Question],
  [TaskResourceType.Question]: [
    TaskResourceType.Claim,
    TaskResourceType.Question,
  ],
  [TaskResourceType.NewClaim]: [TaskResourceType.NewClaim],
  [TaskResourceType.StaleClaim]: [TaskResourceType.StaleClaim],
} as const

const CLAIM_TASK_AREAS = [
  TaskResourceArea.AccidentalDamage,
  TaskResourceArea.TheftAndAssault,
  TaskResourceArea.Appliance,
  TaskResourceArea.FireWaterStuffEvac,
  TaskResourceArea.Travel,
  TaskResourceArea.LiabilityLegal,
  TaskResourceArea.Building,
  TaskResourceArea.InstallationsGlass,
  TaskResourceArea.Qasa,
  TaskResourceArea.Accident,
  TaskResourceArea.Car,
  TaskResourceArea.Pet,
  TaskResourceArea.Handover,
] as const

const SERVICE_TASK_AREAS = [
  TaskResourceArea.ServiceSales,
  TaskResourceArea.Payments,
  TaskResourceArea.Terminations,
  TaskResourceArea.ContractChanges,
  TaskResourceArea.Pet,
  TaskResourceArea.Handover,
] as const

const APPLICABLE_TASK_AREAS = {
  [TaskResourceType.Claim]: CLAIM_TASK_AREAS,
  [TaskResourceType.Question]: SERVICE_TASK_AREAS,
  [TaskResourceType.NewClaim]: CLAIM_TASK_AREAS,
  [TaskResourceType.StaleClaim]: CLAIM_TASK_AREAS,
} as const

const TaskResourceAreaParent: Record<
  TaskResourceArea,
  TaskResourceArea | undefined
> = {
  [TaskResourceArea.ServiceSales]: undefined,
  [TaskResourceArea.Payments]: TaskResourceArea.ServiceSales,
  [TaskResourceArea.Terminations]: TaskResourceArea.ServiceSales,
  [TaskResourceArea.ContractChanges]: TaskResourceArea.ServiceSales,
  [TaskResourceArea.Pet]: undefined,
  [TaskResourceArea.Home]: undefined,
  [TaskResourceArea.AccidentalDamage]: TaskResourceArea.Home,
  [TaskResourceArea.TheftAndAssault]: TaskResourceArea.Home,
  [TaskResourceArea.Appliance]: TaskResourceArea.Home,
  [TaskResourceArea.FireWaterStuffEvac]: TaskResourceArea.Home,
  [TaskResourceArea.Travel]: TaskResourceArea.Home,
  [TaskResourceArea.LiabilityLegal]: TaskResourceArea.Home,
  [TaskResourceArea.Building]: TaskResourceArea.Home,
  [TaskResourceArea.InstallationsGlass]: TaskResourceArea.Home,
  [TaskResourceArea.Qasa]: undefined,
  [TaskResourceArea.Accident]: undefined,
  [TaskResourceArea.Car]: undefined,
  [TaskResourceArea.Handover]: undefined,
}

const TaskResourceAreaName: Record<TaskResourceArea, string> = {
  [TaskResourceArea.ServiceSales]: 'Service & Sales',
  [TaskResourceArea.Payments]: 'Payments',
  [TaskResourceArea.Terminations]: 'Terminations',
  [TaskResourceArea.ContractChanges]: 'Contract changes',
  [TaskResourceArea.Pet]: 'Pet insurance',
  [TaskResourceArea.Home]: 'Home insurance',
  [TaskResourceArea.AccidentalDamage]: 'Accidental damage',
  [TaskResourceArea.TheftAndAssault]: 'Theft, Vandalism and Burglary & Assault',
  [TaskResourceArea.Appliance]: 'Appliance',
  [TaskResourceArea.FireWaterStuffEvac]: 'Fire & Water (stuff and evac)',
  [TaskResourceArea.Travel]: 'Travel',
  [TaskResourceArea.LiabilityLegal]: 'Liability & Legal protection',
  [TaskResourceArea.Building]: 'Building',
  [TaskResourceArea.InstallationsGlass]: 'Installations & Glass',
  [TaskResourceArea.Qasa]: 'Qasa insurance',
  [TaskResourceArea.Accident]: 'Accident insurance',
  [TaskResourceArea.Car]: 'Car insurance',
  [TaskResourceArea.Handover]: 'Handover',
}

const TaskResourceAreas: ReadonlyArray<{
  value: TaskResourceArea
  parent?: TaskResourceArea
}> = Object.values(TaskResourceArea).reduce(
  (areas, value) => {
    areas.push({ value, parent: TaskResourceAreaParent[value] })
    return areas
  },
  [] as {
    value: TaskResourceArea
    parent?: TaskResourceArea
  }[],
)

const TaskResourceAreaIcon: Record<TaskResourceArea, string> = {
  [TaskResourceArea.Car]: '🚗',
  [TaskResourceArea.Pet]: '🐩',
  [TaskResourceArea.Building]: '🏠',
  [TaskResourceArea.Home]: '🛋️',
  [TaskResourceArea.Travel]: '🛫',
  [TaskResourceArea.TheftAndAssault]: '🥷',
  [TaskResourceArea.Qasa]: '🔑',
  [TaskResourceArea.ServiceSales]: '🛒',
  [TaskResourceArea.Payments]: '💵',
  [TaskResourceArea.Terminations]: '❌',
  [TaskResourceArea.ContractChanges]: '📑',
  [TaskResourceArea.Handover]: '🧠',
  [TaskResourceArea.Accident]: '🚑',
  [TaskResourceArea.AccidentalDamage]: '📱',
  [TaskResourceArea.Appliance]: '📺',
  [TaskResourceArea.FireWaterStuffEvac]: '🔥💧',
  [TaskResourceArea.InstallationsGlass]: '🔧🪟',
  [TaskResourceArea.LiabilityLegal]: '👩‍⚖️',
}

export {
  APPLICABLE_TASK_TYPES,
  APPLICABLE_TASK_AREAS,
  TaskResourceAreas,
  TaskResourceAreaIcon,
  TaskResourceAreaName,
}
