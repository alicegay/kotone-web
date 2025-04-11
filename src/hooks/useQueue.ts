import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Item from 'jellyfin-api/lib/types/media/Item'
import { Track } from '../types/ItemTypes'
import itemToType from '../lib/itemToType'
import storage from '../lib/storage'
import usePlayer from './usePlayer'

interface QueueStore {
  track: number
  trackID?: string
  queue: Track[]
  repeat: 'off' | 'track' | 'queue'

  setTrack: (index: number, stealth?: boolean) => void
  prevTrack: () => void
  nextTrack: () => void
  setRepeat: (mode: 'off' | 'track' | 'queue') => void
  cycleRepeat: () => void

  setQueue: (items: Item[] | Track[], index?: number) => void
  moveQueue: (fromIndex: number, toIndex: number) => void
  clearQueue: () => void
  addQueue: (items: Item[] | Track[]) => void
  nextQueue: (items: Item[] | Track[]) => void
  removeQueue: (index: number) => void

  hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

const useQueue = create<QueueStore>()(
  persist(
    (set, get) => ({
      track: 0,
      trackID: undefined,
      queue: [],
      repeat: 'off',

      setTrack: (index) => {
        set((state) => ({ track: index, trackID: state.queue[index].Id }))
      },
      prevTrack: async () => {
        const current = get().track
        // const progress = await TrackPlayer.getProgress()
        // if (progress.position < 1.0 && current !== 0) {
        //   set((state) => ({
        //     track: state.track - 1,
        //     trackID: state.queue[state.track - 1].Id,
        //   }))
        //   await TrackPlayer.skipToPrevious()
        // } else {
        //   await TrackPlayer.seekTo(0)
        // }
      },
      nextTrack: () => {
        const current = get().track
        const length = get().queue.length
        const repeat = get().repeat
        if (current === length - 1) {
          if (repeat === 'queue') {
            set((state) => ({ track: 0, trackId: state.queue[0].Id }))
            // TrackPlayer.skip(0)
          } else if (repeat == 'track') {
            // TrackPlayer.seekTo(0)
          }
        } else {
          set((state) => ({
            track: state.track + 1,
            trackID: state.queue[state.track + 1].Id,
          }))
          // TrackPlayer.skipToNext()
        }
      },
      setRepeat: (mode) => {
        set(() => ({ repeat: mode }))
      },
      cycleRepeat: () => {
        const current = get().repeat
        get().setRepeat(
          current === 'off' ? 'queue' : current === 'queue' ? 'track' : 'off',
        )
      },

      setQueue: async (items, index = 0) => {
        const tracks = items.map((item) => itemToType(item) as Track)
        set(() => ({ queue: tracks, track: index, trackID: items[index].Id }))
        // await TrackPlayer.setQueue(items.map((item) => itemToRNTPTrack(item)))
        // await TrackPlayer.skip(index)
      },
      moveQueue: async (fromIndex, toIndex) => {
        const newQueue = [...get().queue]
        const removed = newQueue.splice(fromIndex, 1)
        newQueue.splice(toIndex, 0, removed[0]!)
        let newIndex = get().track
        if (fromIndex === newIndex) {
          newIndex = toIndex
        } else if (fromIndex < newIndex && toIndex >= newIndex) {
          newIndex--
        } else if (fromIndex > newIndex && toIndex <= newIndex) {
          newIndex++
        }
        set(() => ({
          queue: newQueue,
          track: newIndex,
          trackID: newQueue[newIndex].Id,
        }))
        // await TrackPlayer.move(fromIndex, toIndex)
      },
      clearQueue: () => {
        set(() => ({ queue: [], track: 0, trackID: undefined }))
        // TrackPlayer.reset()
      },
      addQueue: (items) => {
        const tracks = items.map((item) => itemToType(item) as Track)
        set((state) => ({ queue: [...state.queue, ...tracks] }))
        // TrackPlayer.add(items.map((item) => itemToRNTPTrack(item)))
      },
      nextQueue: (items) => {
        const tracks = items.map((item) => itemToType(item) as Track)
        set((state) => ({
          queue: [
            ...state.queue.slice(0, state.track + 1),
            ...tracks,
            ...state.queue.slice(state.track + 1),
          ],
        }))
        // TrackPlayer.add(
        //   items.map((item) => itemToRNTPTrack(item)),
        //   get().track + 1,
        // )
      },
      removeQueue: (index) => {
        const newQueue = [...get().queue]
        newQueue.splice(index, 1)
        set(() => ({ queue: newQueue }))
        // TrackPlayer.remove(index)
        if (get().track >= newQueue.length - 1 && newQueue.length > 0) {
          set(() => ({
            track: 0,
            trackID: newQueue[0].Id,
          }))
          //TrackPlayer.skip(newQueue.length - 1)
        } else if (index < get().track) {
          set(() => ({
            track: get().track - 1,
            trackID: newQueue[get().track - 1].Id,
          }))
        }
      },

      hasHydrated: false,
      setHasHydrated: (state) => set(() => ({ hasHydrated: state })),
    }),
    {
      name: 'queue',
      storage: createJSONStorage(() => storage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
        usePlayer.getState().setAutoplay(true)
      },
    },
  ),
)

export default useQueue
