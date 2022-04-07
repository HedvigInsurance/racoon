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
    ...(margins.m && { margin: margins.m }),
    ...(margins.mt && { marginTop: margins.mt || margins.my }),
    ...(margins.mb && { marginBottom: margins.mb || margins.my }),
    ...(margins.ms && { marginLeft: margins.ms || margins.mx }),
    ...(margins.me && { marginRight: margins.me || margins.mx }),
  }
}
