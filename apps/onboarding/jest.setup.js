// Used for @testing-library/react
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'

// Mock next-i18next
jest.mock('next-i18next', () => {
  return {
    useTranslation: () => {
      return {
        t: (str) => str,
        i18n: {
          language: 'en',
          changeLanguage: jest.fn().mockImplementation((lang) => console.log(lang)),
        },
      }
    },
    withTranslation: () => (Component) => {
      Component.defaultProps = { ...Component.defaultProps, t }
      return Component
    },
  }
})
