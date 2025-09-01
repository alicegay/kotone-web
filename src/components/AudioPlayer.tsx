import { DOMAttributes, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Hls from 'hls.js'
import useClient from '../hooks/useClient'
import useQueue from '../hooks/useQueue'
import emitter, { Event } from '../lib/emitter'
import usePlayer from '../hooks/usePlayer'
import useProgress from '../hooks/useProgress'
import useSettings from '../hooks/useSettings'
import { playing, stopped } from '../lib/progress'
import useInterval from '../hooks/useInterval'
import { Track } from '../types/ItemTypes'

const AudioPlayer = () => {
  const queryClient = useQueryClient()
  const client = useClient()
  const queue = useQueue()
  const player = usePlayer()
  const progress = useProgress()
  const settings = useSettings()
  const audio = useRef<HTMLAudioElement>(null)
  const [autoplay, setAutoplay] = useState<boolean>(false)
  const [metadata, setMetadata] = useState<MediaMetadata>()
  const hls = new Hls()

  const track = queue.queue.length > 0 ? queue.queue[queue.track] : undefined
  const image = track
    ? 'Primary' in track.ImageTags
      ? client.server + '/Items/' + track.Id + '/Images/Primary?maxHeight=512'
      : 'AlbumPrimaryImageTag' in track && track.AlbumPrimaryImageTag
        ? client.server + '/Items/' + track.AlbumId + '/Images/Primary?512'
        : null
    : null
  useEffect(() => {
    if (track && image) {
      setMetadata(
        new MediaMetadata({
          title: track.Name,
          artist: track.Artists.join(', '),
          album: track.Album,
          artwork: [{ src: image! }],
        }),
      )
    }
  }, [track, image])

  const reportNewTrack = async (track: Track) => {
    if (track) {
      await playing(undefined, track.Id)
      queryClient.invalidateQueries({
        queryKey: ['items', { SortBy: 'DatePlayed' }],
        exact: false,
      })
    }
  }
  useEffect(() => {
    reportNewTrack(track)
  }, [track])

  const actionHandlers: [
    action: MediaSessionAction,
    handler: MediaSessionActionHandler | null,
  ][] = [
    ['play', () => player.play()],
    ['pause', () => player.pause()],
    ['stop', () => queue.clearQueue()],
    ['previoustrack', () => queue.prevTrack()],
    ['nexttrack', () => queue.nextTrack()],
  ]

  if ('mediaSession' in navigator) {
    if (metadata) navigator.mediaSession.metadata = metadata
    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, track ? handler : null)
      } catch {
        console.log(`The media session action "${action}" is not supported.`)
      }
    }
  }

  const gain = settings.gain
    ? track
      ? 'NormalizationGain' in track
        ? Math.min(
            Math.max(Math.pow(10, track.NormalizationGain / 20), 0.0),
            1.0,
          )
        : 0.5
      : 0.5
    : 1.0
  useEffect(() => {
    if (audio.current && Number.isFinite(gain)) {
      audio.current.volume = gain
    }
  }, [gain])

  const audioSource =
    queue.queue.length > 0
      ? client.server +
        '/Audio/' +
        track.Id +
        '/main.m3u8?userId=' +
        client.user +
        '&deviceId=' +
        client.deviceID +
        '&maxStreamingBitrate=140000000' +
        '&container=opus,webm|opus,ts|mp3,aac,m4a|aac,m4b|aac,mp4|flac,webma,webm|webma,wav,ogg' +
        '&transcodingContainer=ts' +
        '&transcodingProtocol=hls' +
        '&audioCodec=copy' +
        '&SegmentContainer=' +
        (track.Container.toLowerCase() === 'mp3' ? 'ts' : 'mp4') +
        '&apiKey=' +
        client.token
      : undefined

  useEffect(() => {
    if (audioSource) {
      hls.loadSource(audioSource)
      hls.attachMedia(audio.current!)
    } else {
      audio.current.src = null
    }
  }, [audioSource])

  useEffect(() => {
    emitter.on('play', event)
    emitter.on('pause', event)
    emitter.onp('seek', seek)
    return () => {
      emitter.off('play', event)
      emitter.off('pause', event)
      emitter.off('seek', seek)
    }
  }, [])

  const event = (event: Event) => {
    if (event === 'play') audio.current?.play()
    if (event === 'pause') audio.current?.pause()
  }
  const seek = (payload: number) => {
    if (audio.current) audio.current.currentTime = payload
  }

  const audioEvents: DOMAttributes<HTMLAudioElement> = {
    onPlay: async () => {
      player.setIsPlaying(true)
      player.setIsBuffering(false)
      await playing('unpause')
    },
    onPause: async () => {
      player.setIsPlaying(false)
      await playing('pause')
    },
    onEnded: async () => {
      queue.nextTrack()
      await stopped()
    },
    onWaiting: () => {
      console.log('WAITING')
      player.setIsBuffering(true)
    },
    onTimeUpdate: (e) => {
      progress.setProgress(e.currentTarget.currentTime)
    },
    onLoadedMetadata: (e) => {
      player.setDuration(e.currentTarget.duration)
    },
  }

  useInterval(async () => {
    await playing('timeupdate')
  }, 10_000)

  useEffect(() => {
    if (queue.hasHydrated) {
      setTimeout(() => {
        setAutoplay(true)
      }, 300)
    }
  }, [queue.hasHydrated])

  return (
    <audio
      ref={audio}
      preload="auto"
      autoPlay={autoplay}
      loop={queue.repeat === 'track'}
      {...audioEvents}
    />
  )
}

export default AudioPlayer
