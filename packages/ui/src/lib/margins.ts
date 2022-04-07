export type Margins = {
  // margin-left and margin-right
  mx?: string
  // margin-top and margin-bottom
  my?: string
  // margin-left
  ms?: string
  // margin-right
  me?: string
  // margin-top
  mt?: string
  // margin-bottom
  mb?: string
  // all margins
  m?: string
}

export const getMargins = (margins: Margins) => {
  return {
    margin: margins.m,
    marginTop: margins.mt || margins.my,
    marginBottom: margins.mb || margins.my,
    marginLeft: margins.ms || margins.mx,
    marginRight: margins.me || margins.mx,
  }
}
