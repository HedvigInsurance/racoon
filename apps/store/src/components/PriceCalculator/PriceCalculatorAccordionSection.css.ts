import { style } from '@vanilla-extract/css'
import { tokens } from 'ui/src/theme'

enum Area {
  Icon = 'icon',
  Title = 'title',
  Edit = 'edit',
  Preview = 'preview',
}

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gridTemplateRows: 'auto auto',
  gridTemplateAreas: `
    "${Area.Icon} ${Area.Title}   ${Area.Edit}"
    ".            ${Area.Preview} ${Area.Preview}"
  `,
  columnGap: tokens.space.xs,
  alignItems: 'center',
})

export const gridIcon = style({ gridArea: Area.Icon, paddingTop: 1 })
export const gridTitle = style({ gridArea: Area.Title })
export const gridPreview = style({ gridArea: Area.Preview })
export const gridEdit = style({ gridArea: Area.Edit })
