import type { SlashCommand } from './slack.constants'

export type SlashCommandRequest = {
  command: SlashCommand
  response_url: string
  user_id: string
  user_name: string
}
