import { IncomingHttpHeaders } from 'http'

export type TIncomingHeaders = {
  [K in keyof IncomingHttpHeaders as string extends K ? never : number extends K ? never : K]: IncomingHttpHeaders[K]
}
