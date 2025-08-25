import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import NavBar from '../components/NavBar'
import FloatingPlayer from '../components/FloatingPlayer/FloatingPlayer'
import AudioPlayer from '../components/AudioPlayer'
import Menu from '../components/Menu/Menu'
import useLibrary from '../hooks/useLibrary'
import useSettings from '../hooks/useSettings'
import useQueue from '../hooks/useQueue'
import useMenu from '../hooks/useMenu'
import useViews from '../api/useViews'
import useItems from '../api/useItems'
import { cn } from '../lib/cn'
import { Blurhash } from 'react-blurhash'
import isDesktop from '../lib/isDesktop'
import RPC from '../components/RPC'

const Layout = () => {
  const library = useLibrary()
  const settings = useSettings()
  const queue = useQueue()
  const { showMenu, hideMenu } = useMenu()
  const location = useLocation()
  const playerScreen = location.pathname.split('/')[1] === 'player'

  const track = queue.queue.length > 0 ? queue.queue[queue.track] : undefined
  const blurhash = track
    ? 'Primary' in track.ImageBlurHashes
      ? track.ImageBlurHashes.Primary[
          'Primary' in track.ImageTags
            ? track.ImageTags.Primary
            : track.AlbumPrimaryImageTag
        ]
      : null
    : null

  const views = useViews()
  useEffect(() => {
    if (views.data) {
      library.setViews(views.data)
      const ids = {}
      for (let i = 0; i < views.data.length; i++) {
        ids[views.data[i].CollectionType] = views.data[i].Id
      }
      library.setViewIDs(ids)
    }
  }, [views.data])

  const musicView =
    library.viewIDs && 'music' in library.viewIDs ? library.viewIDs.music : null

  const albums = useItems(
    {
      ParentId: musicView!,
      SortBy: 'Name',
      SortOrder: 'Ascending',
      IncludeItemTypes: 'MusicAlbum',
      Recursive: true,
    },
    !!musicView && settings.useLibrary,
  )
  useEffect(() => {
    if (albums.data) console.log('ALBUM LIBRARY SET')
    if (albums.data) library.setAlbums(albums.data.Items)
  }, [albums.data])

  const tracks = useItems(
    {
      SortBy: 'Name',
      SortOrder: 'Ascending',
      IncludeItemTypes: 'Audio',
      Recursive: true,
      Fields: 'MediaSources',
    },
    settings.useLibrary,
  )
  useEffect(() => {
    if (albums.data) console.log('SONG LIBRARY SET')
    if (tracks.data) library.setTracks(tracks.data.Items)
  }, [tracks.data])

  useEffect(() => {
    const handleClick = () => hideMenu()
    const handleContext = (e: MouseEvent) => e.preventDefault()
    document.addEventListener('click', handleClick)
    if (process.env.NODE_ENV !== 'development')
      document.addEventListener('contextmenu', handleContext)
    return () => {
      document.removeEventListener('click', handleClick)
      if (process.env.NODE_ENV !== 'development')
        document.addEventListener('contextmenu', handleContext)
    }
  }, [])

  return (
    <>
      <div
        className={cn(
          'flex w-full flex-col overflow-hidden',
          !playerScreen && 'bg-primary',
        )}
      >
        {playerScreen && (
          <div className="absolute -z-100 h-screen w-full overflow-hidden bg-zinc-900">
            {blurhash && (
              <>
                <div className="absolute -z-90 h-screen w-full bg-zinc-900/20" />
                <Blurhash
                  hash={blurhash}
                  width="100%"
                  height="100%"
                  className="-z-100"
                />
              </>
            )}
          </div>
        )}

        <NavBar />

        <div
          className={cn(
            'h-full w-full overflow-x-hidden',
            !showMenu ? 'overflow-y-scroll' : 'overflow-y-hidden',
          )}
        >
          <Outlet />
        </div>

        <FloatingPlayer />
        <Menu />
      </div>
      <AudioPlayer />
      {isDesktop && <RPC />}
    </>
  )
}

export default Layout
