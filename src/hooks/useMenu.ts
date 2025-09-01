import { MouseEvent } from 'react'
import { create } from 'zustand'
import Item from 'jellyfin-api/lib/types/media/Item'
import { Album, Track } from '../types/ItemTypes'

type Types = 'track' | 'album' | 'artist' | 'queue'

interface MenuStore {
  showMenu: boolean

  x: number
  y: number
  type: Types
  data?: Item | Track | Album

  setMenu: (event: MouseEvent, type: Types, data?: Item | Track | Album) => void
  hideMenu: () => void
}

const useMenu = create<MenuStore>()((set, get) => ({
  showMenu: false,

  x: 0,
  y: 0,
  type: 'track',
  data: undefined,

  setMenu: (event, type, data) => {
    event.preventDefault()
    set(() => ({
      showMenu: true,
      x: Math.min(Math.max(event.pageX - 24, 16), window.innerWidth - 256 - 16),
      y: Math.min(
        Math.max(event.pageY - 24, 16),
        window.innerHeight - 336 - 16,
      ),
      type: type,
      data: data,
    }))
  },
  hideMenu: () => {
    if (get().showMenu) set(() => ({ showMenu: false }))
  },
}))

export default useMenu
