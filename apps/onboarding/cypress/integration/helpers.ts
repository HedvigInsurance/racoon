import faker from '@faker-js/faker'

export const getRandomBirthDateDK = () => {
  const pastDate = faker.date.between('1940-01-01', '1990-01-01')
  const date = String(pastDate.getDate()).padStart(2, '0')
  const month = String(pastDate.getMonth() + 1).padStart(2, '0')
  return `${date}-${month}-${pastDate.getFullYear()}`
}
