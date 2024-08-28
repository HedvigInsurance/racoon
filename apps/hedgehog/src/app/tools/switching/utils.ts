import { format, parseISO } from 'date-fns'

export function formatTime(timestamp: string): string {
  return format(parseISO(timestamp), 'y-MM-dd HH:mm')
}
