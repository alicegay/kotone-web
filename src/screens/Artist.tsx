import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeGrid } from 'react-window'
import { Link, useLocation, useParams } from 'react-router'
import { cn } from '../lib/cn'
import useLibrary from '../hooks/useLibrary'
import useMenu from '../hooks/useMenu'
import useItems from '../api/useItems'
import SquareListItem from '../components/SquareListItem'
import LoadingIndicator from '../components/LoadingIndicator'
import useSingleItem from '../api/useSingleItem'
import useClient from '../hooks/useClient'
import Icon from '../components/Icon'

const Artist = () => {
  const { artist: artistParam } = useParams()
  const client = useClient()
  const { showMenu, setMenu } = useMenu()
  const location = useLocation()
  const playlist = location.pathname.split('/')[1] === 'playlists'

  const albums = useItems({
    SortBy: 'PremiereDate,ProductionYear,Sortname',
    SortOrder: 'Descending',
    IncludeItemTypes: 'MusicAlbum',
    Recursive: true,
    ArtistIds: artistParam,
  })
  const artist = useSingleItem(artistParam)

  const image = artist.data
    ? 'Primary' in artist.data.ImageTags
      ? client.server + '/Items/' + artistParam + '/Images/Primary'
      : 'AlbumPrimaryImageTag' in artist.data &&
          artist.data.AlbumPrimaryImageTag
        ? client.server + '/Items/' + artist.data.AlbumId + '/Images/Primary'
        : null
    : null

  return (
    <div className="flex h-full flex-col gap-4 px-4 pt-4">
      {albums.data && !albums.isLoading && artist.data && !artist.isLoading ? (
        <>
          <div className="flex h-full gap-4">
            {image ? (
              <img
                src={image}
                className="round-2 aspect-square size-96 object-cover"
              />
            ) : (
              <div className="round-2 bg-b flex aspect-square size-96 items-center justify-center object-cover">
                <Icon icon="artist" filled size={128} />
              </div>
            )}

            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-2 px-4">
                <div className="text-4xl font-bold">{artist.data.Name}</div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-4">
                    <div>
                      {albums.data.Items.length +
                        ' album' +
                        (albums.data.Items.length !== 1 ? 's' : '')}
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
                          albums.data.Items.length / columnCount,
                        )}
                        className={cn(
                          'player-padding',
                          //showMenu && 'overflow-y-hidden!',
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
                                showYear
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
            </div>
          </div>
        </>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  )
}

export default Artist
