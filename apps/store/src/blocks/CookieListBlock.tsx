'use client'
import styled from '@emotion/styled'
import { useSetAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { useEffect } from 'react'
import { mq, theme } from 'ui'
import { loadOneTrustAtom } from '@/components/CookieConsent/OneTrustAtom'
import * as GridLayout from '@/components/GridLayout/GridLayout'

export const CookieListBlock = () => {
  const { t } = useTranslation('cookieConsent')
  const setLoadOneTrust = useSetAtom(loadOneTrustAtom)

  // Load OneTrust script to display the cookie list and handle user preferences
  useEffect(() => {
    setLoadOneTrust(true)
  }, [setLoadOneTrust])

  return (
    <GridLayout.Root>
      <GridLayout.Content width={{ base: '1', md: '2/3', xxl: '1/2' }} align={'center'}>
        <PreferenceButton id="ot-sdk-btn" className="ot-sdk-show-settings">
          {t('COOKIE_CONSENT_SETTINGS_BUTTON')}
        </PreferenceButton>
        <OneTrustCookieInfo id="ot-sdk-cookie-policy"></OneTrustCookieInfo>
      </GridLayout.Content>
    </GridLayout.Root>
  )
}

/**
 * OneTrust CSS overides for Cookie List
 * Styling is written in string litteral to make it easy
 * to migrate between OneTrust and the component
 */

const PreferenceButton = styled.button({
  '&#ot-sdk-btn.ot-sdk-show-settings': {
    backgroundColor: theme.colors.translucent1,
    color: theme.colors.textPrimary,
    height: '2.5rem',
    paddingInline: theme.space.md,
    paddingBlock: 0,
    fontSize: theme.fontSizes.md,
    borderRadius: theme.radius.sm,
    border: 0,
    boxShadow: theme.shadow.default,
    backdropFilter: 'blur(30px)',

    '@media (hover: hover)': {
      ':hover': {
        backgroundColor: theme.colors.translucent2,
        color: theme.colors.textPrimary,
      },
    },

    ':active': {
      backgroundColor: theme.colors.translucent2,
    },
  },
})

const OneTrustCookieInfo = styled.div`
  * {
    font-weight: 400 !important;
    -webkit-font-smoothing: antialiased !important;
    -moz-osx-font-smoothing: grayscale !important;
  }

  #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy #cookie-policy-description,
  #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-cookie-policy-group-desc {
    font-size: ${theme.fontSizes.md};
  }

  #ot-sdk-cookie-policy .ot-sdk-container,
  #ot-sdk-cookie-policy-v2 {
    padding: 0 !important;
  }

  #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-table-header,
  #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy td {
    font-size: ${theme.space.md};
  }

  #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table th,
  #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table td {
    border-color: ${theme.colors.borderTranslucent2};
  }

  #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy h3,
  #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy h4 {
    font-weight: 400;
    line-height: 1.26;
  }

  .ot-cookies-td:before {
    color: ${theme.colors.textPrimary};
  }

  #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy h3,
  #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy h4 {
    margin-top: ${theme.space.xxl};
    margin-bottom: ${theme.space.xs};
    font-size: ${theme.fontSizes.md};
  }

  #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy a,
  #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy a:hover {
    background-color: transparent;
  }

  #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-cookie-policy-group {
    margin-bottom: ${theme.space.xs};
  }

  ${mq.md} {
    #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy h3,
    #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy h4 {
      font-size: ${theme.fontSizes.xl};
    }

    #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy #cookie-policy-description,
    #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-sdk-cookie-policy-group-desc {
      font-size: ${theme.fontSizes.xl};
    }

    #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy table {
      font-size: ${theme.fontSizes.md};
    }
  }
  ${mq.lg} {
    #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy .ot-table-header,
    #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy td {
      font-size: ${theme.fontSizes.md};
    }
  }

  /* OneTrust breakpoint override */
  @media only screen and (max-width: 530px) {
    #ot-sdk-cookie-policy-v2.ot-sdk-cookie-policy td:before {
      font-weight: 400;
      color: ${theme.colors.textPrimary};
    }
  }
`
