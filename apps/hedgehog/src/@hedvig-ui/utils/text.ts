export const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export const convertEnumToTitle = (enumText: string) => {
  return enumText
    .toLowerCase()
    .split('_')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export const convertEnumOrSentenceToTitle = (enumText: string) => {
  return enumText
    .toLowerCase()
    .split(/_|\s|-/)
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}

export const convertEnumToSentence = (enumText: string) => {
  return capitalize(enumText.split('_').join(' '))
}

export const formatPostalCode = (postalCode: string): string => {
  if (postalCode.length === 5) {
    return postalCode.slice(0, 3) + ' ' + postalCode.slice(3)
  }
  return postalCode
}

export const convertCamelcaseToTitle = (text: string) =>
  text.charAt(0).toUpperCase() + text.substring(1).replace(/(\B[A-Z])/g, ' $1')

export const isStringNumber = (s: string) =>
  /^-?\d+$/.test(s) || /^\d+\.\d+$/.test(s)

export const convertEmailToName = (text: string) =>
  text
    .split('@')[0]
    .split('.')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')

export const convertEmailToSignature = (text: string) =>
  text
    .split('@')[0]
    .split('.')
    .map((word) => {
      return word.charAt(0).toUpperCase()
    })
    .join('')

export const convertFullNameToShort = (fullName: string) =>
  fullName
    .split(' ')
    .map((name, index) => {
      if (index === 0) return name + ' '
      return name.charAt(0)
    })
    .join('')

export const addSToName = (firstName: string): string => {
  const nameEndsOnS = firstName[firstName?.length - 1] === 's'
  return !nameEndsOnS ? `${firstName}’s` : firstName
}

export const formatSsn = (ssn: string) => {
  const SWEDISH_SSN_LENGTHS = [10, 12]
  const NORWEGIAN_SSN_LENGTH = 11

  if (SWEDISH_SSN_LENGTHS.includes(ssn.length)) {
    return (
      ssn.slice(ssn.length - 10, ssn.length - 4) +
      '-' +
      ssn.slice(ssn.length - 4, ssn.length)
    )
  }

  if (ssn.length === NORWEGIAN_SSN_LENGTH) {
    return ssn.slice(0, 6) + '-' + ssn.slice(6, 11)
  }

  return ssn
}
