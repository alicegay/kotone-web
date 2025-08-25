import { Link } from 'react-router'
import useLibrary from '../hooks/useLibrary'
import useQueue from '../hooks/useQueue'
import usePlayer from '../hooks/usePlayer'
import useMenu from '../hooks/useMenu'
import useItems from '../api/useItems'
import useLatest from '../api/useLatest'
import SquareListItem from '../components/SquareListItem'
import TrackListItem from '../components/TrackListItem'
import LinkedHeader from '../components/LinkedHeader'

const Home = () => {
  const library = useLibrary()
  const queue = useQueue()
  const { play } = usePlayer()
  const { setMenu } = useMenu()

  const musicView =
    library.viewIDs && 'music' in library.viewIDs ? library.viewIDs.music : null
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
  const frequentPlayed = useItems({
    SortBy: 'PlayCount',
    SortOrder: 'Descending',
    IncludeItemTypes: 'Audio',
    Recursive: true,
    Filter: 'IsPlayed',
    Limit: 4,
    Fields: 'MediaSources',
  })
  const recentlyPlayed = useItems({
    SortBy: 'DatePlayed',
    SortOrder: 'Descending',
    IncludeItemTypes: 'Audio',
    Recursive: true,
    Filter: 'IsPlayed',
    Limit: 4,
    Fields: 'MediaSources',
  })
  const recentlyAdded = useLatest(musicView!, { Limit: 50 }, !!musicView)

  return (
    <div className="player-padding flex flex-col gap-4 pt-4">
      {!playlists.isLoading && playlists.data && (
        <div className="flex flex-col gap-1">
          <LinkedHeader to="/playlists">Playlists</LinkedHeader>
          <div className="flex gap-4 overflow-x-scroll px-4">
            {playlists.data.Items.map((item) => (
              <Link key={'playlist_' + item.Id} to={'/playlist/' + item.Id}>
                <SquareListItem
                  item={item}
                  onContextMenu={(e) => setMenu(e, 'album', item)}
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        {!frequentPlayed.isLoading && frequentPlayed.data && (
          <div className="flex flex-1 flex-col">
            <LinkedHeader to="/frequentlyplayed">
              Frequently Played
            </LinkedHeader>
            <div className="flex flex-col px-4">
              {frequentPlayed.data.Items.map((item, index) => (
                <TrackListItem
                  key={'rp_' + index}
                  item={item}
                  onClick={() => {
                    queue.setQueue([item])
                    play()
                  }}
                  onContextMenu={(e) => setMenu(e, 'track', item)}
                  playing={item.Id === queue.trackID}
                />
              ))}
            </div>
          </div>
        )}

        {!recentlyPlayed.isLoading && recentlyPlayed.data && (
          <div className="flex flex-1 flex-col">
            <LinkedHeader to="/recentlyplayed">Recently Played</LinkedHeader>
            <div className="flex flex-col px-4">
              {recentlyPlayed.data.Items.map((item, index) => (
                <TrackListItem
                  key={'rp_' + index}
                  item={item}
                  onClick={() => {
                    queue.setQueue([item])
                    play()
                  }}
                  onContextMenu={(e) => setMenu(e, 'track', item)}
                  playing={item.Id === queue.trackID}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {!recentlyAdded.isLoading && recentlyAdded.data && (
        <div className="flex flex-col gap-1">
          <LinkedHeader to="/">Recently Added</LinkedHeader>
          <div className="flex gap-4 overflow-x-scroll px-4">
            {recentlyAdded.data.map((item) => (
              <Link key={'ra_' + item.Id} to={'/album/' + item.Id}>
                <SquareListItem
                  item={item}
                  onContextMenu={(e) => setMenu(e, 'album', item)}
                />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
