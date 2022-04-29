import { colorsV3 } from '@hedviginsurance/brand'
import { getColor } from './theme'

describe('theme', () => {
  describe('getColor', () => {
    it('should return a color when found in colorsV3', () => {
      expect(getColor('gray100')).toEqual(colorsV3.gray100)
    })

    it('should return a simplified color when found in simplifiedColors', () => {
      expect(getColor('lavender')).toEqual(colorsV3.purple500)
    })

    it('should default to currentColor when no other colors can be found', () => {
      expect(getColor('smurf')).toEqual('currentColor')
    })
  })
})
