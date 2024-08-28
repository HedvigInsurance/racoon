import { MainHeadline } from '@hedvig-ui'
import * as React from 'react'
import { Button, yStack } from 'ui'

const getDayPartGreeting = (name: string) => {
  const hours = new Date().getHours()
  if (hours >= 0 && hours < 6) {
    return `Good night, ${name} - shouldn’t you be asleep?`
  } else if (hours >= 6 && hours < 12) {
    return `Good morning, ${name}!`
  } else if (hours >= 12 && hours < 18) {
    return `Good afternoon, ${name}!`
  } else if (hours >= 18 && hours <= 23) {
    return `Good evening, ${name}!`
  }

  return `Hello ${name}`
}

export const Greeting: React.FC<{ userName: string }> = ({ userName }) => {
  const greeting = getDayPartGreeting(userName)
  return (
    <div className={yStack({ gap: 'xl' })}>
      <MainHeadline>{greeting}</MainHeadline>
      <Button variant="secondary" size="large">
        click me
      </Button>
    </div>
  )
}
