import { useReducer } from 'react'

type FormState = {
  state: 'IDLE' | 'EDIT' | 'ERROR'
  errorMsg?: string
}

type ActionErrorWithPayload = { state: 'ERROR'; errorMsg?: string }

type FormStateReducerAction = FormState['state'] | ActionErrorWithPayload

export const usePurchaseFormState = (initialState?: FormState) => {
  const [state, dispatch] = useReducer(reducer, initialState ?? { state: 'IDLE' })

  return [state, dispatch] as const
}

const reducer = (state: FormState, action: FormStateReducerAction): FormState => {
  const actionType = typeof action === 'string' ? action : action.state

  switch (actionType) {
    case 'IDLE':
      return { state: 'IDLE' }
    case 'EDIT':
      return { state: 'EDIT' }
    case 'ERROR':
      return { state: 'ERROR', errorMsg: (action as ActionErrorWithPayload)?.errorMsg }
    default:
      return state
  }
}
