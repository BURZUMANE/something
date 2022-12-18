type Nullable<T> = T | null;

interface ICCancellationObject {
  [key: string]: {
    handleRequestCancellation: () => AbortController
  }
}

export function defineCancelApiObject(apiObject: { [key: string]: Function }) {
  const cancelApiObject: ICCancellationObject = {}

  Object.getOwnPropertyNames(apiObject).forEach((apiPropertyName) => {
    const cancellationControllerObject: { controller: Nullable<AbortController> } = {
      controller: null,
    }
    cancelApiObject[apiPropertyName] = {
      handleRequestCancellation: (): AbortController => {
        if (cancellationControllerObject.controller) {
          cancellationControllerObject.controller.abort()
        }

        cancellationControllerObject.controller = new AbortController()

        return cancellationControllerObject.controller
      },
    }
  })

  return cancelApiObject
}

