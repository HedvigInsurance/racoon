import { colors } from './colors/colors'
import { getColor } from './theme'

describe('theme', () => {
  describe('getColor', () => {
    it('should return a UI Color when found', () => {
      expect(getColor('gray100')).toEqual(colors.gray100)
    })

    it('should return a simplified color when found in simplifiedColors', () => {
      expect(getColor('lavender')).toEqual(colors.lavender)
    })
  })
})
