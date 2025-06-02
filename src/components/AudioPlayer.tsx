import { DOMAttributes, useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import useClient from '../hooks/useClient'
import useQueue from '../hooks/useQueue'
import emitter, { Event } from '../lib/emitter'
import usePlayer from '../hooks/usePlayer'
import useProgress from '../hooks/useProgress'
import useSettings from '../hooks/useSettings'
import { Track } from '../types/ItemTypes'

const AudioPlayer = () => {
  const client = useClient()
  const queue = useQueue()
  const player = usePlayer()
  const progress = useProgress()
  const settings = useSettings()
  const audio = useRef<HTMLAudioElement>(null)
  const [autoplay, setAutoplay] = useState<boolean>(false)
  const [metadata, setMetadata] = useState<MediaMetadata>()
  const hls = new Hls()

  if (metadata && 'mediaSession' in navigator) {
    navigator.mediaSession.metadata = metadata
  }

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
    if (audio.current) audio.current.volume = gain
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
    onPlay: () => {
      player.setIsPlaying(true)
      player.setIsBuffering(false)
    },
    onPause: () => {
      player.setIsPlaying(false)
    },
    onEnded: () => {
      queue.nextTrack()
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
      // src={audioSource}
      preload="auto"
      autoPlay={autoplay}
      loop={queue.repeat === 'track'}
      {...audioEvents}
    />
  )
}

export default AudioPlayer
