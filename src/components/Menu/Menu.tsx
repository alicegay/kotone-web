import { AnimatePresence, motion } from 'motion/react'
import { Blurhash } from 'react-blurhash'
import useMenu from '../../hooks/useMenu'
import TrackMenu from './TrackMenu'
import AlbumMenu from './AlbumMenu'
import QueueMenu from './QueueMenu'

const Menu = () => {
  const menu = useMenu()

  const item = menu.data
  const blurhash = item
    ? 'Primary' in item.ImageBlurHashes
      ? item.ImageBlurHashes.Primary[
          'Primary' in item.ImageTags
            ? item.ImageTags.Primary
            : // @ts-expect-error who care
              item.AlbumPrimaryImageTag
        ]
      : null
    : null

  return (
    <AnimatePresence>
      {menu.showMenu && (
        <motion.div
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{
            duration: 0.1,
            easings: ['easeIn', 'easeOut'],
          }}
          className="round absolute w-64 overflow-hidden text-zinc-100"
          style={{
            left: menu.x,
            top: menu.y,
          }}
        >
          <div className="round pointer-events-none absolute z-90 h-full w-64 overflow-hidden bg-zinc-900">
            {blurhash && (
              <Blurhash hash={blurhash} width="100%" height="100%" />
            )}
          </div>
          {menu.type === 'track' && <TrackMenu />}
          {menu.type === 'album' && <AlbumMenu />}
          {menu.type === 'queue' && <QueueMenu />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Menu
