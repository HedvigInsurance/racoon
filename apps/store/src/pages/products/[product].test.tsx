import { getPage } from 'next-page-tester'
import { screen } from '@/test/utils'

describe('<NextProductPage />', () => {
  test('it should render a product page based on the provided slug', async () => {
    const { render } = await getPage({ route: '/products/car' })
    render()

    expect(await screen.findByRole('heading', { level: 1, name: /car insurance/i })).toBeVisible()
  })

  test('it should render 404 page when slug provided is not valid', async () => {
    const { render } = await getPage({ route: '/products/doe' })
    render()

    expect(await screen.findByRole('heading', { level: 1, name: '404' })).toBeVisible()
    expect(
      await screen.findByRole('heading', { level: 2, name: /this page could not be found/i }),
    ).toBeVisible()
  })
})
