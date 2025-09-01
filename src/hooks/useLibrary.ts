import Item from 'jellyfin-api/lib/types/media/Item'
import itemToType from '../lib/itemToType'
import { Album, Playlist, Track } from '../types/ItemTypes'
import { create } from 'zustand'

interface LibraryStore {
  views: Item[]
  viewIDs: { [key: string]: string }
  tracks: Track[]
  albums: Album[]
  artists: Item[]
  playlists: Playlist[]
  favorites: Track[]
  musicvideos: Track[]

  setViews: (views: Item[]) => void
  setViewIDs: (viewIDs: { [key: string]: string }) => void
  setTracks: (tracks: Item[]) => void
  setAlbums: (albums: Item[]) => void
  setArtists: (artists: Item[]) => void
  setPlaylists: (playlists: Item[]) => void
  setFavorites: (favorites: Item[]) => void
  setMusicvideos: (musicvideos: Item[]) => void

  likeTrack: (ID: string, like: boolean) => void
}

const useLibrary = create<LibraryStore>()((set, get) => ({
  views: null,
  viewIDs: null,
  tracks: null,
  albums: null,
  artists: null,
  playlists: null,
  favorites: null,
  musicvideos: null,

  setViews: (views) => {
    set(() => ({ views: views }))
  },
  setViewIDs: (viewIDs) => {
    set(() => ({ viewIDs: viewIDs }))
  },
  setTracks: (tracks) => {
    const items = tracks.map((item) => itemToType(item) as Track)
    set(() => ({ tracks: items }))
  },
  setAlbums: (albums) => {
    const items = albums.map((item) => itemToType(item) as Album)
    set(() => ({ albums: items }))
  },
  setArtists: (artists) => {
    set(() => ({ artists: artists }))
  },
  setPlaylists: (playlists) => {
    const items = playlists.map((item) => itemToType(item) as Playlist)
    set(() => ({ playlists: items }))
  },
  setFavorites: (favorites) => {
    const items = favorites.map((item) => itemToType(item) as Track)
    set(() => ({ favorites: items }))
  },
  setMusicvideos: (musicvideos) => {
    const items = musicvideos.map((item) => itemToType(item) as Track)
    set(() => ({ musicvideos: items }))
  },

  likeTrack: (ID, like) => {
    const tracks = get().tracks
    const indexes = tracks
      .map((track, index) => (track.Id === ID ? index : -1))
      .filter((index) => index !== -1)
    for (let i = 0; i < indexes.length; i++) {
      if ('UserData' in tracks[indexes[i]] && tracks[indexes[i]].UserData) {
        tracks[indexes[i]].UserData!.IsFavorite = like
      }
    }
  },
}))

export default useLibrary
