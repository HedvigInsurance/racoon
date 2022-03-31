export type Margins = {
  marginLeft?: string
  marginRight?: string
  marginTop?: string
  marginBottom?: string
  margin?: string
}

export const getMargins = (margins: Margins & any) => {
  return {
    margin: margins.margin,
    marginTop: margins.marginTop,
    marginBottom: margins.marginBottom,
    marginLeft: margins.marginLeft,
    marginRight: margins.marginRight,
  }
}
