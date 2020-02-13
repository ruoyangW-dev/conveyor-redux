const localStorageKey = 'debug'

export const isEnabled = key => localStorage.getItem(key) !== null

export const enable = () => {
  if (!isEnabled(localStorageKey)) {
    localStorage.setItem(localStorageKey, '1') // arbitrary value
  }
}

export const log = (...args) => {
  if (!isEnabled()) {
    return
  }
  console.log(...args)
}
export const epicError = (epicName, context, error) => {
  if (!isEnabled()) {
    return
  }
  console.group(`${epicName} error`)
  console.log('context')
  console.log(context)
  console.log('\nerror')
  console.log(error)
  console.groupEnd()
}

// unhandled error caught by root epic
export const rootEpicError = (epicName, error) => {
  if (!isEnabled()) {
    return
  }
  console.group(`unhandled error in ${epicName}`)
  console.log(error)
  console.groupEnd()
}

export const inputValidationParseValidationErrors = (response, e) => {
  if (!isEnabled()) { return }
  console.group('inputValidation parseValidationErrors error')
  console.log('response')
  console.log(response)
  console.log('\nexception')
  console.log(e)
  console.groupEnd()
}
