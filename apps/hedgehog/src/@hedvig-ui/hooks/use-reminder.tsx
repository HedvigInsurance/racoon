import { Fragment } from 'react'
import { addDays } from 'date-fns/addDays'
import { useCookies } from 'react-cookie'
import { Key } from './keyboard/use-key-is-pressed'
import toast from 'react-hot-toast'
import { HintKey, HintPlus } from '../HotkeyHint'

export const REMINDERS_COOKIE_NAME = '_hvg_reminders'

export const toastReminder = ({ keys }: { keys: Key[] }) =>
  toast(
    () => (
      <div>
        <span style={{ marginRight: '0.35rem' }}>Try to use </span>
        {keys.map((key, index) => (
          <Fragment key={index + key.hint}>
            {index !== 0 && (
              <HintPlus dark padding>
                +
              </HintPlus>
            )}
            <HintKey dark>{key.hintAlternative ?? key.hint}</HintKey>
          </Fragment>
        ))}
        <span style={{ marginLeft: '0.5rem' }}>next time</span>
      </div>
    ),
    {
      position: 'bottom-right',
      style: {
        width: 'fit-content',
      },
    },
  )

export const useRemindersCookies = () => {
  const [cookies, setCookie] = useCookies([REMINDERS_COOKIE_NAME])

  const showReminder = (name: string, keys?: Key[]) => {
    if (
      cookies[REMINDERS_COOKIE_NAME] &&
      cookies[REMINDERS_COOKIE_NAME].includes(name)
    ) {
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = addDays(today, 1)

    if (!cookies[REMINDERS_COOKIE_NAME]) {
      setCookie(REMINDERS_COOKIE_NAME, [name], {
        expires: tomorrow,
        path: '/',
      })
    } else {
      setCookie(
        REMINDERS_COOKIE_NAME,
        [
          ...cookies[REMINDERS_COOKIE_NAME].filter(
            (cookie: string) => cookie !== name,
          ),
          name,
        ],
        {
          expires: tomorrow,
          path: '/',
        },
      )
    }

    keys && keys.length > 0 && toastReminder({ keys })
  }

  return { showReminder }
}
