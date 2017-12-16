export function forEach (array, fn) {
  let length = array.length
  for (let i = 0; i < length; i++) {
    fn(array[i])
  }
}

export function assert (condition, errorMessage) {
  if (!condition) {
    throw new Error(errorMessage)
  }
}