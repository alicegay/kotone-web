import { SetActivity } from '@xhayper/discord-rpc'

export {}

declare global {
  interface Window {
    electron: boolean
    api: {
      rpc: {
        login: () => void
        ready: (callback: () => void) => void
        setActivity: (activity: SetActivity) => void
        clearActivity: () => void
      }
      glass: boolean
    }
  }
}
