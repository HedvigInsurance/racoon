export type Margins = {
  // margin-left and margin-right
  mx?: string
  // margin-top and margin-bottom
  my?: string
  // margin-left
  ml?: string
  // margin-right
  mr?: string
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
    ...(margins.ml && { marginLeft: margins.ml || margins.mx }),
    ...(margins.mr && { marginRight: margins.mr || margins.mx }),
  }
}
