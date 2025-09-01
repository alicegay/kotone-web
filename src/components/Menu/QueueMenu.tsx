import useMenu from '../../hooks/useMenu'
import useQueue from '../../hooks/useQueue'
import usePlayer from '../../hooks/usePlayer'
import useItems from '../../api/useItems'
import { useNavigate } from 'react-router'
import Option from './Option'
import Separator from './Separator'

const QueueMenu = () => {
  const menu = useMenu()
  const queue = useQueue()
  const { play } = usePlayer()
  const navigate = useNavigate()

  return (
    <div className="relative z-100 flex flex-col bg-zinc-900/20">
      <Option
        text="Shuffle Queue"
        icon="shuffle"
        onClick={() => {
          queue.setQueue(
            [...queue.queue].sort(() => Math.random() - 0.5),
            0,
          )
          play()
        }}
      />
      <Separator />
      <Option text="Add to Playlist" icon="playlist_add" disabled />
      <Separator />
      <Option
        text="Clear Queue"
        icon="playlist_remove"
        onClick={() => {
          queue.clearQueue()
          navigate('/')
        }}
      />
    </div>
  )
}

export default QueueMenu
