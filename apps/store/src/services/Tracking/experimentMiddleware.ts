import { NextRequest, NextResponse } from 'next/server'
import { EXPERIMENT_COOKIE_NAME, type ExperimentVariant } from './experiment.constants'
import { getExperimentVariant, getCurrentExperiment } from './experiment.helpers'

const ONE_WEEK = 7 * 24 * 3600

type AssignedVariant = {
  variant: ExperimentVariant
  cookieValue: string
}

const assignVariant = (): AssignedVariant | undefined => {
  const currentExperiment = getCurrentExperiment()
  if (!currentExperiment) return

  let number = Math.random() * 100

  const variant = currentExperiment.variants.find((variant) => {
    if (variant.weight >= number) return true
    number -= variant.weight
  })

  if (!variant) {
    console.warn(`No variant found for experiment: ${currentExperiment.name}`)
    return
  }

  return {
    variant,
    cookieValue: `${currentExperiment.id}.${variant.id}`,
  }
}

const getAssignedVariant = (req: NextRequest): AssignedVariant | undefined => {
  const cookie = req.cookies.get(EXPERIMENT_COOKIE_NAME)
  if (!cookie) return

  const experimentVariant = getExperimentVariant(cookie.value)
  if (!experimentVariant) return

  return {
    variant: experimentVariant,
    cookieValue: cookie.value,
  }
}

export const experimentMiddleware = (req: NextRequest) => {
  const currentExperiment = getCurrentExperiment()
  if (!currentExperiment) return

  const slug = currentExperiment.slug.replace(req.nextUrl.locale, '')
  if (req.nextUrl.pathname !== slug) return

  let assignedVariant = getAssignedVariant(req)

  if (!assignedVariant) {
    assignedVariant = assignVariant()
    if (!assignedVariant) return
    console.debug(`AB test | assigning variant: ${assignedVariant.variant.name}`)
  } else {
    console.debug(`AB test | found assigned variant: ${assignedVariant.variant.name}`)
  }

  const url = req.nextUrl

  if (assignedVariant.variant.id !== 0) {
    if (!assignedVariant.variant.slug) {
      throw new Error(`No slug found for variant: ${assignedVariant.variant.name}`)
    }

    url.pathname = assignedVariant.variant.slug
  }

  const response = NextResponse.rewrite(url)

  if (!req.cookies.has(EXPERIMENT_COOKIE_NAME)) {
    console.debug(`AB test | setting cookie: ${assignedVariant.cookieValue}`)
    response.cookies.set(EXPERIMENT_COOKIE_NAME, assignedVariant.cookieValue, { maxAge: ONE_WEEK })
  }

  return response
}
