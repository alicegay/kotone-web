import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeGrid } from 'react-window'
import { Link } from 'react-router'
import { cn } from '../lib/cn'
import useLibrary from '../hooks/useLibrary'
import useMenu from '../hooks/useMenu'
import useLatest from '../api/useLatest'
import SquareListItem from '../components/SquareListItem'
import LoadingIndicator from '../components/LoadingIndicator'

const RecentlyAdded = () => {
  const library = useLibrary()
  const { showMenu, setMenu } = useMenu()

  const musicView =
    library.viewIDs && 'music' in library.viewIDs ? library.viewIDs.music : null
  const albums = useLatest(musicView!, { Limit: 500 }, !!musicView)

  return (
    <div className="flex h-full flex-col gap-4 pt-4">
      {albums.data && !albums.isLoading ? (
        <>
          <div className="flex flex-col gap-2 px-4">
            <div className="text-4xl font-bold">Recently Added</div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  {albums.data.length +
                    ' album' +
                    (albums.data.length !== 1 ? 's' : '')}{' '}
                  from the latest 500 tracks
                </div>
              </div>
            </div>
          </div>

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
                    rowCount={Math.ceil(albums.data.length / columnCount)}
                    className={cn(
                      'player-padding',
                      //showMenu && 'overflow-y-hidden!',
                    )}
                  >
                    {({ columnIndex, rowIndex, style }) => {
                      const index = Math.floor(
                        columnCount * rowIndex + columnIndex,
                      )
                      return index < albums.data.length ? (
                        <Link
                          key={index}
                          to={'/album/' + albums.data[index].Id}
                          style={{
                            ...style,
                            paddingLeft: 16,
                            paddingRight: 16,
                            paddingBottom: 8,
                          }}
                        >
                          <SquareListItem
                            item={albums.data[index]}
                            onContextMenu={(e) =>
                              setMenu(e, 'album', albums.data[index])
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
        </>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  )
}

export default RecentlyAdded
