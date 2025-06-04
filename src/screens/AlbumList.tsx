import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeGrid } from 'react-window'
import { Link, useLocation } from 'react-router'
import { cn } from '../lib/cn'
import useLibrary from '../hooks/useLibrary'
import useMenu from '../hooks/useMenu'
import useItems from '../api/useItems'
import SquareListItem from '../components/SquareListItem'

const AlbumList = () => {
  const library = useLibrary()
  const { showMenu, setMenu } = useMenu()
  const location = useLocation()
  const playlist = location.pathname.split('/')[1] === 'playlists'

  const musicView = playlist
    ? library.viewIDs && 'playlists' in library.viewIDs
      ? library.viewIDs.playlists
      : null
    : library.viewIDs && 'music' in library.viewIDs
      ? library.viewIDs.music
      : null
  const albums = useItems(
    {
      ParentId: musicView,
      SortBy: playlist ? 'SortName' : 'Name',
      SortOrder: 'Ascending',
      IncludeItemTypes: 'MusicAlbum',
      Recursive: true,
    },
    !!musicView,
  )

  return (
    <div className="h-full pt-4">
      {albums.data && !albums.isLoading && (
        <div className="flex h-full flex-1">
          <AutoSizer>
            {({ height, width }) => {
              const columnCount = Math.floor((width - 8) / (192 + 16 * 2))
              return (
                <FixedSizeGrid
                  width={width}
                  height={height}
                  rowHeight={284 + 8}
                  columnWidth={192 + 32}
                  columnCount={columnCount}
                  rowCount={Math.ceil(albums.data.Items.length / columnCount)}
                  className={cn(
                    'player-padding',
                    showMenu && 'overflow-y-hidden!',
                  )}
                >
                  {({ columnIndex, rowIndex, style }) => {
                    const index = Math.floor(
                      columnCount * rowIndex + columnIndex,
                    )
                    return index < albums.data.Items.length ? (
                      <Link
                        key={index}
                        to={
                          (playlist ? '/playlist/' : '/album/') +
                          albums.data.Items[index].Id
                        }
                        style={{
                          ...style,
                          paddingLeft: 16,
                          paddingRight: 16,
                          paddingBottom: 8,
                        }}
                      >
                        <SquareListItem
                          item={albums.data.Items[index]}
                          onContextMenu={(e) =>
                            setMenu(e, 'album', albums.data.Items[index])
                          }
                        />
                      </Link>
                    ) : (
                      <div style={style} />
                    )
                  }}
                </FixedSizeGrid>
              )
            }}
          </AutoSizer>
        </div>
      )}
    </div>
  )
}

export default AlbumList
