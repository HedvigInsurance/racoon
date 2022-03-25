import { ClientPassage, PassageElement } from 'embark-core'
import { useEffect } from 'react'

export const useSubmitGraphQLEffect = (submitForm: () => void, passage: ClientPassage) => {
  useEffect(() => {
    if (passage.action?.type === PassageElement.GraphQLAPI) {
      submitForm()
    }
  }, [passage, submitForm])
}
