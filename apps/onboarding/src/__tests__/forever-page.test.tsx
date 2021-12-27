import type { NextRouter } from 'next/router'
import { render, waitFor, screen } from '@testing-library/react'

import ForeverPage from '@/pages/forever/index.page'

import { LOAD_CHAR_INTERVAL } from '@/pages/forever/hooks/use-print-code-effect'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('<ForeverPage />', () => {
  afterEach(() => {
    useRouter.mockClear()
  })

  it('should get the code from URL', async () => {
    const code = '123456'
    useRouter.mockImplementation(() => ({
      query: { code },
      asPath: `/forever?code=${code}`,
      prefetch: () => Promise.resolve(),
    }))

    const { getByRole } = render(<ForeverPage />)

    const input = getByRole('textbox', { name: /FOREVER_LANDINGPAGE_INPUT_TEXT/i })

    // It uses 'usePrintCodeEffect' internally which will load the campaign code provided in the URL
    // character by character and using a 'LOAD_CHAR_INTERVAL' length interval. So we need to wait until all
    // code's characters are loaded before making the the assertion.
    await waitFor(() => expect(input).toHaveValue('123456'), {
      timeout: code.length * LOAD_CHAR_INTERVAL,
    })
  })
})
