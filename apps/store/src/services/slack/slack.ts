type Message = {
  response_type: 'ephemeral' | 'in_channel'
  text: string
}

export class Slack {
  constructor(private readonly responseUrl: string) {}

  public static composeMessage(text: string): Message {
    return {
      response_type: 'ephemeral',
      text: text,
    }
  }

  public async sendMessage(text: string): Promise<void> {
    const response = await fetch(this.responseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Slack.composeMessage(text)),
    })

    if (!response.ok) {
      console.warn(`Failed to send Slack message (${text})`, response.status, response.statusText)
      throw new Error(`Failed to send Slack message ${text}`)
    }
  }
}
