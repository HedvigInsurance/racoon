export const extractErrorMessage = (message: string): string => {
  if (message.includes('JSON parse error')) {
    return 'Something went wrong'
  }
  return message.includes(' : ') ? message.split(' : ')[1] : message
}
