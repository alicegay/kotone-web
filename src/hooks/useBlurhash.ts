import { create } from 'zustand'

interface BlurhashStore {
  blurhash?: string

  setBlurhash: (blurhash: string) => void
}

const useBlurhash = create<BlurhashStore>()((set) => ({
  blurhash: null,

  setBlurhash: (blurhash) => set(() => ({ blurhash: blurhash })),
}))

export default useBlurhash
