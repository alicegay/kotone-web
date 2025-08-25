import useMenu from '../../hooks/useMenu'
import useQueue from '../../hooks/useQueue'
import usePlayer from '../../hooks/usePlayer'
import { useNavigate } from 'react-router'
import Option from './Option'
import Separator from './Separator'
import { Track } from '../../types/ItemTypes'

const TrackMenu = () => {
  const menu = useMenu()
  const queue = useQueue()
  const { play } = usePlayer()
  const navigate = useNavigate()

  const track = menu.data! as Track

  return (
    <div className="relative z-100 flex flex-col bg-zinc-900/20">
      <Option
        text="Play"
        icon="play_arrow"
        iconFilled
        onClick={() => {
          queue.setQueue([track])
          play()
        }}
      />
      <Option
        text="Play Next"
        icon="playlist_play"
        onClick={() => {
          queue.nextQueue([track])
        }}
      />
      <Option
        text="Add to Queue"
        icon="playlist_add"
        onClick={() => {
          queue.addQueue([track])
        }}
      />
      <Option text="Instant Mix" icon="album" disabled />
      {/* <Option text="Remove from queue" icon="playlist_remove" /> */}
      <Separator />
      <Option text="Add to Playlist" icon="playlist_add" disabled />
      <Separator />
      <Option
        text="View Album"
        icon="album"
        onClick={() => {
          navigate('/album/' + track.AlbumId)
        }}
      />
      <Option
        text="View Artist"
        icon="artist"
        iconFilled
        onClick={() => {
          navigate('/artist/' + track.AlbumArtists[0].Id)
        }}
      />
    </div>
  )
}

export default TrackMenu
