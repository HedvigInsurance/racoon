import { Alert } from 'ui'
import { type FormStateWithErrors } from '@/app/types/formStateTypes'
import { ErrorMessages } from '@/components/FormErrors/ErrorMessages'

export function FormResults({ formState }: { formState: FormStateWithErrors }) {
  return (
    <>
      <ErrorMessages errors={formState?.errors?.generic} />
      {formState?.messages?.map((message, index) => (
        <Alert.Root key={index} variant={message.type}>
          <Alert.Message>{message.content}</Alert.Message>
        </Alert.Root>
      ))}
    </>
  )
}
