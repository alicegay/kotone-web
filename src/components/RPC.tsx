import { useEffect, useState } from 'react'
import useClient from '../hooks/useClient'
import useSettings from '../hooks/useSettings'
import usePlayer from '../hooks/usePlayer'
import useProgress from '../hooks/useProgress'
import useQueue from '../hooks/useQueue'
import ActivityType from '../types/ActivityType'
import { ticksToSecs } from '../lib/ticksToTime'
import StatusDisplayType from '../types/StatusDisplayType'

const RPC = () => {
  const client = useClient()
  const settings = useSettings()
  const queue = useQueue()
  const { isPlaying } = usePlayer()
  const { progress } = useProgress()
  const [ready, setReady] = useState(false)

  window.api.rpc.ready(() => setReady(true))

  useEffect(() => {
    if (!ready) window.api.rpc.login()
  }, [ready])

  const track = queue.queue.length > 0 ? queue.queue[queue.track] : undefined

  const baseURL = settings.RPCProxy ? settings.RPCProxyURL : client.server
  const image = track
    ? 'Primary' in track.ImageTags
      ? baseURL +
        '/Items/' +
        track.Id +
        '/Images/Primary?format=webp&width=512&height=512'
      : 'AlbumPrimaryImageTag' in track && track.AlbumPrimaryImageTag
        ? baseURL +
          '/Items/' +
          track.AlbumId +
          '/Images/Primary?format=webp&width=512&height=512'
        : null
    : null

  useEffect(() => {
    if (ready) {
      if (track) {
        window.api.rpc.setActivity({
          type: ActivityType.Listening,
          name: 'Kotone',
          statusDisplayType: StatusDisplayType.State,
          details: track.Name,
          state: track.Artists.join(', '),
          largeImageText: track.Album,
          largeImageKey: settings.RPCImage ? image : undefined,
          startTimestamp: Date.now() - progress * 1000,
          endTimestamp: isPlaying
            ? Date.now() +
              ticksToSecs(track.RunTimeTicks) * 1000 -
              progress * 1000
            : undefined,
        })
      } else {
        window.api.rpc.clearActivity()
      }
    }
  }, [track, isPlaying, ready])

  return <div className="hidden" />
}

export default RPC
