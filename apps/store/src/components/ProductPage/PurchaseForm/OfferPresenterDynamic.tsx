import dynamic from 'next/dynamic'

export const loadOfferPresenter = async () => {
  const { OfferPresenter } = await import('./OfferPresenter')
  return OfferPresenter
}

export const OfferPresenterDynamic = dynamic(loadOfferPresenter)
