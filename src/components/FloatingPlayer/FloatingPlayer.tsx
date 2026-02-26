import { AnimatePresence, motion } from 'motion/react'
import { Blurhash } from 'react-blurhash'
import { useLocation, useNavigate } from 'react-router'
import useClient from '../../hooks/useClient'
import useQueue from '../../hooks/useQueue'
import useProgress from '../../hooks/usePlayer'
import Progress from './Progress'
import Button from './Button'

const FloatingPlayer = () => {
  const client = useClient()
  const queue = useQueue()
  const player = useProgress()
  const navigate = useNavigate()
  const location = useLocation()

  const track = queue.queue.length > 0 ? queue.queue[queue.track] : undefined
  const image = track
    ? 'Primary' in track.ImageTags
      ? client.server + '/Items/' + track.Id + '/Images/Primary?maxHeight=96'
      : 'AlbumPrimaryImageTag' in track && track.AlbumPrimaryImageTag
        ? client.server +
          '/Items/' +
          track.AlbumId +
          '/Images/Primary?maxHeight=96'
        : null
    : null
  const blurhash = track
    ? 'Primary' in track.ImageBlurHashes
      ? track.ImageBlurHashes.Primary[
          'Primary' in track.ImageTags
            ? track.ImageTags.Primary
            : track.AlbumPrimaryImageTag
        ]
      : null
    : null

  return (
    <AnimatePresence>
      {track && location.pathname.split('/')[1] !== 'player' && (
        <motion.div
          className="absolute bottom-4 flex w-full justify-center"
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{
            duration: 0.1,
            ease: ['easeIn', 'easeOut'],
          }}
          onClick={() => {
            navigate('/player')
          }}
        >
          <div className="player-width round pointer-events-none absolute z-10 h-full overflow-hidden bg-zinc-900">
            {blurhash && (
              <Blurhash
                hash={blurhash}
                width="100%"
                height={256}
                className="-top-24"
              />
            )}
          </div>
          <div className="text-w round player-width z-20 flex items-center overflow-hidden bg-zinc-900/20">
            <Progress />
            <div className="flex grow gap-4">
              <div className="round bg-w h-16 w-16 overflow-hidden">
                <img
                  src={image!}
                  className="aspect-square h-16 w-16 object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="text-xl font-medium">{track?.Name}</div>
                <div className="text-zinc-100/60">
                  {track?.Artists.join(', ')}
                </div>
              </div>
            </div>
            <div className="flex px-4">
              <Button
                icon="skip_previous"
                onClick={(e) => {
                  queue.prevTrack()
                  e.stopPropagation()
                }}
                show="sm"
              />
              <Button
                icon={player.isPlaying ? 'pause' : 'play_arrow'}
                onClick={(e) => {
                  player.playpause()
                  e.stopPropagation()
                }}
              />
              <Button
                icon="stop"
                onClick={(e) => {
                  queue.clearQueue()
                  e.stopPropagation()
                }}
                show="md"
              />
              <Button
                icon="skip_next"
                onClick={(e) => {
                  queue.nextTrack()
                  e.stopPropagation()
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FloatingPlayer
