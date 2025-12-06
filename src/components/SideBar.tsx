import { useLocation, useNavigate } from 'react-router'
import { cn } from '../lib/cn'
import isDesktop from '../lib/isDesktop'
import Button from './SideBar/Button'
import useLibrary from '../hooks/useLibrary'
import useItems from '../api/useItems'
import Separator from './SideBar/Separator'
import useMenu from '../hooks/useMenu'

const SideBar = () => {
  const library = useLibrary()
  const location = useLocation()
  const screen = location.pathname.split('/')[1]
  const navigate = useNavigate()
  const { setMenu } = useMenu()

  const playlistView =
    library.viewIDs && 'playlists' in library.viewIDs
      ? library.viewIDs.playlists
      : null
  const playlists = useItems(
    {
      ParentId: playlistView!,
      SortBy: 'PlayCount,SortName',
      SortOrder: 'Descending',
      Limit: 10,
    },
    !!playlistView,
  )

  return (
    <div
      className={cn(
        'flex w-72 flex-col gap-1 overflow-y-scroll bg-zinc-900/40 p-2',
        isDesktop() && 'mb-2 ml-2 rounded-3xl',
      )}
    >
      <Button
        icon="home"
        filled
        selected={!screen}
        onClick={() => navigate('/')}
      >
        Home
      </Button>
      <Button
        icon="album"
        selected={screen == 'albums'}
        onClick={() => navigate('/albums')}
      >
        Albums
      </Button>
      <Button
        icon="music_note"
        selected={screen == 'tracks'}
        onClick={() => navigate('/tracks')}
      >
        Tracks
      </Button>
      <Button
        icon="artist"
        filled
        selected={screen == 'artists'}
        onClick={() => navigate('/artists')}
      >
        Artists
      </Button>

      <Separator />

      <Button
        icon="queue_music"
        selected={screen == 'playlists'}
        onClick={() => navigate('/playlists')}
      >
        Playlists
      </Button>
      <Button
        icon="music_cast"
        selected={screen == 'frequentlyplayed'}
        onClick={() => navigate('/frequentlyplayed')}
      >
        Frequently Played
      </Button>
      <Button
        icon="history"
        selected={screen == 'recentlyplayed'}
        onClick={() => navigate('/recentlyplayed')}
      >
        Recently Played
      </Button>
      <Button
        icon="history"
        selected={screen == 'recentlyadded'}
        onClick={() => navigate('/recentlyadded')}
      >
        Recently Added
      </Button>

      {!playlists.isLoading && playlists.data && (
        <>
          <Separator />
          <div className="mx-4 text-xs text-zinc-100/60">PLAYLISTS</div>
          {playlists.data.Items.map((item) => (
            <Button
              selected={
                screen == 'playlist' &&
                location.pathname.split('/')[2] === item.Id
              }
              onClick={() => navigate('/playlist/' + item.Id)}
              onContextMenu={(e) => setMenu(e, 'album', item)}
            >
              {item.Name}
            </Button>
          ))}
        </>
      )}
    </div>
  )
}

export default SideBar
