import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type { Experiment } from './experiment.constants'
import { EXPERIMENT_COOKIE_NAME, type ExperimentVariant } from './experiment.constants'
import { getExperimentVariant, getCurrentExperiments } from './experiment.helpers'

const ONE_WEEK = 7 * 24 * 3600

type AssignedVariant = {
  variant: ExperimentVariant
  cookieValue: string
}

const assignVariant = (experiment: Experiment): AssignedVariant | undefined => {
  let number = Math.random() * 100

  const variant = experiment.variants.find((variant) => {
    if (variant.weight >= number) return true
    number -= variant.weight
  })

  if (!variant) {
    console.warn(`No variant found for experiment: ${experiment.name}`)
    return
  }

  return {
    variant,
    cookieValue: `${experiment.id}.${variant.id}`,
  }
}

const getAssignedVariant = (
  req: NextRequest,
  experimentId: string,
): AssignedVariant | undefined => {
  const cookie = req.cookies.get(`${EXPERIMENT_COOKIE_NAME}:${experimentId}`)
  if (!cookie) return

  const experimentVariant = getExperimentVariant(cookie.value)
  if (!experimentVariant) return

  return {
    variant: experimentVariant,
    cookieValue: cookie.value,
  }
}

export const experimentMiddleware = (req: NextRequest): NextResponse | undefined => {
  const currentExperiments = getCurrentExperiments()
  if (!currentExperiments) return

  const response = NextResponse.next()

  // Loop over experiments and set experiment cookie if not already set
  currentExperiments.forEach((currentExperiment) => {
    let assignedVariant = getAssignedVariant(req, currentExperiment.id)
    if (!assignedVariant) {
      assignedVariant = assignVariant(currentExperiment)
      if (!assignedVariant) return
      console.debug(`AB test | assigning variant: ${assignedVariant.variant.name}`)
    } else {
      console.debug(`AB test | found assigned variant: ${assignedVariant.variant.name}`)
    }

    const experimentCookie = `${EXPERIMENT_COOKIE_NAME}:${currentExperiment.id}`

    if (!req.cookies.has(experimentCookie)) {
      console.debug(`AB test | setting cookie: ${experimentCookie}`)
      response.cookies.set(experimentCookie, assignedVariant.cookieValue, {
        maxAge: ONE_WEEK,
      })
    }
  })

  return response
}
