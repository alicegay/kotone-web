import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import useSettings from '../hooks/useSettings'
import useLibrary from '../hooks/useLibrary'
import useQueue from '../hooks/useQueue'
import useSearch from '../hooks/useSearch'
import formatName from '../lib/formatName'
import { cn } from '../lib/cn'
import TrackListItem from '../components/TrackListItem'
import Item from 'jellyfin-api/lib/types/media/Item'
import usePlayer from '../hooks/usePlayer'
import useMenu from '../hooks/useMenu'
import LoadingIndicator from '../components/LoadingIndicator'

const Search = () => {
  const settings = useSettings()
  const library = useLibrary()
  const queue = useQueue()
  const { play } = usePlayer()
  const search = useSearch()
  const { showMenu, setMenu } = useMenu()

  const query = settings.useLibrary ? formatName(search.query) : search.query
  const items = library.tracks
    ? library.tracks.filter((song) => song.Search!.includes(formatName(query)))
    : null

  return (
    <div className="flex h-full px-4 pt-4">
      {items ? (
        <div className="flex flex-1">
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                width={width}
                height={height}
                itemCount={items.length}
                itemSize={72}
                className={cn(
                  'player-padding',
                  showMenu && 'overflow-y-hidden!',
                )}
              >
                {({ index, style }) => (
                  <TrackListItem
                    item={items[index] as Item}
                    showAlbumArt
                    showArtist
                    style={style}
                    onClick={() => {
                      const current = queue.trackID
                      queue.setQueue([items[index]], 0)
                      if (items[index].Id === current) play()
                    }}
                    onContextMenu={(e) => setMenu(e, 'track', items[index])}
                    playing={items[index].Id === queue.trackID}
                  />
                )}
              </FixedSizeList>
            )}
          </AutoSizer>
        </div>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  )
}

export default Search
