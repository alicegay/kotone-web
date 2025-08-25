import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeGrid } from 'react-window'
import { Link, useLocation } from 'react-router'
import { cn } from '../lib/cn'
import useLibrary from '../hooks/useLibrary'
import useMenu from '../hooks/useMenu'
import useAlbumArtists from '../api/useAlbumArtists'
import SquareListItem from '../components/SquareListItem'
import LoadingIndicator from '../components/LoadingIndicator'

const ArtistList = () => {
  const library = useLibrary()
  const { showMenu, setMenu } = useMenu()

  const musicView =
    library.viewIDs && 'music' in library.viewIDs ? library.viewIDs.music : null
  const artists = useAlbumArtists(
    {
      ParentId: musicView,
      SortBy: 'SortName',
      SortOrder: 'Ascending',
      Recursive: true,
    },
    !!musicView,
  )

  return (
    <div className="flex h-full flex-col gap-4 pt-4">
      {artists.data && !artists.isLoading ? (
        <>
          <div className="flex flex-col gap-2 px-4">
            <div className="text-4xl font-bold">Artists</div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  {artists.data.Items.length +
                    ' artist' +
                    (artists.data.Items.length !== 1 ? 's' : '')}
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
                    rowCount={Math.ceil(
                      artists.data.Items.length / columnCount,
                    )}
                    className={cn(
                      'player-padding',
                      showMenu && 'overflow-y-hidden!',
                    )}
                  >
                    {({ columnIndex, rowIndex, style }) => {
                      const index = Math.floor(
                        columnCount * rowIndex + columnIndex,
                      )
                      return index < artists.data.Items.length ? (
                        <Link
                          key={index}
                          to={'/artist/' + artists.data.Items[index].Id}
                          style={{
                            ...style,
                            paddingLeft: 16,
                            paddingRight: 16,
                            paddingBottom: 8,
                          }}
                        >
                          <SquareListItem
                            item={artists.data.Items[index]}
                            // onContextMenu={(e) =>
                            //   setMenu(e, 'artist', artists.data.Items[index])
                            // }
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

export default ArtistList
