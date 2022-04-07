export type Paddings = {
  // padding-left and padding-right
  px?: string
  // padding-top and padding-bottom
  py?: string
  // padding-left
  ps?: string
  // padding-right
  pe?: string
  // padding-top
  pt?: string
  // padding-bottom
  pb?: string
  // all paddings
  p?: string
}

export const getPaddings = (paddings: Paddings) => {
  return {
    ...(paddings.p && { padding: paddings.p }),
    ...(paddings.pt && { paddingTop: paddings.pt || paddings.py }),
    ...(paddings.pb && { paddingBottom: paddings.pb || paddings.py }),
    ...(paddings.ps && { paddingLeft: paddings.ps || paddings.px }),
    ...(paddings.pe && { paddingRight: paddings.pe || paddings.px }),
  }
}
