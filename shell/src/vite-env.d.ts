/// <reference types="vite/client" />

declare module 'shell/UserStore'
declare module 'mfe/MfeApp'
declare module 'virtual:__federation__' {
  export function __federation_method_setRemote(name: string, RemoteConfig: any): void
  export function __federation_method_getRemote(name: string, module: string): Promise<any>
  export function __federation_method_unwrapDefault(module: any): any
}
