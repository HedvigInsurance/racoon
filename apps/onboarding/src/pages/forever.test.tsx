import { render } from '@testing-library/react'

import ForeverPage from './forever'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('<ForeverPage />', () => {
  afterEach(() => {
    useRouter.mockClear()
  })

  it('should get the code from URL', () => {
    useRouter.mockImplementation(() => ({
      query: { code: '123456' },
      asPath: '/forever?code=123456',
    }))

    const { getByRole } = render(<ForeverPage />)

    const input = getByRole('textbox', { name: /FOREVER_LANDINGPAGE_INPUT_TEXT/i })

    expect(input).toHaveValue('123456')
  })
})
