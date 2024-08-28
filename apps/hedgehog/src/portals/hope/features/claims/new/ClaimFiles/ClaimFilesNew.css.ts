import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@hedvig-ui/redesign/theme'

const FILE_ICON_SIZE = '4rem'

export const fileUploadDropzoneButton = style({
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: 'inherit',

  padding: '4rem',

  backgroundColor: theme.colors.gray50,
  border: '1px dashed #C5CFD7',
  borderRadius: theme.radius.md,
})

export const fileUploadDropzoneIcon = style({
  fontSize: FILE_ICON_SIZE,
})

export const fileCardContainer = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, 320px)',
  gap: theme.space.md,
})

export const fileCard = style({
  padding: 0,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.offWhite,
  position: 'relative',
})

export const fileImageContainer = style({
  height: '200px',
  minHeight: '200px',
  cursor: 'pointer',
  borderTopLeftRadius: theme.radius.md,
  borderTopRightRadius: theme.radius.md,
  overflow: 'clip',
})

globalStyle(`${fileImageContainer} > *`, {
  width: '100%',
  height: '100%',
  display: 'grid',
  placeContent: 'center',
  gap: theme.space.xs,
  textAlign: 'center',
})

globalStyle(`${fileImageContainer} img, ${fileImageContainer} video`, {
  objectFit: 'cover',
})

globalStyle(`${fileImageContainer} svg`, {
  fontSize: FILE_ICON_SIZE,
})

globalStyle(`${fileImageContainer} embed`, {
  pointerEvents: 'none',
})

export const topRightOverlay = style({
  position: 'absolute',
  top: theme.space.md,
  right: theme.space.md,
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xs,
})

export const folderPill = style({
  backgroundColor: theme.colors.grayTranslucentDark50,
  borderRadius: 1000,
  fontSize: theme.fontSizes.xs,
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.xxs,
  padding: `${theme.space.xxs} ${theme.space.sm}`,
})

export const modalContent = style({
  maxWidth: '75vw',
  height: '70vh',
  borderTopLeftRadius: theme.radius.md,
  borderTopRightRadius: theme.radius.md,
  overflow: 'clip',
})

globalStyle(`${modalContent} > *`, {
  width: '100%',
  height: '100%',
})

globalStyle(`${modalContent} > :is(img, video)`, {
  objectFit: 'contain',
})

globalStyle(`${modalContent} > object`, {
  width: '75vw',
})
