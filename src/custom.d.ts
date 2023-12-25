declare var webkitSpeechRecognition: any

type JSONValue = string | number | boolean | null | { [k: string | number]: JSONValue } | JSONValue[]

type Resource<T> = {
  data: T
}
