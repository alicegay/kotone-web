import { Link, useParams } from 'react-router'
import { FixedSizeList } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import useClient from '../hooks/useClient'
import useSingleItem from '../api/useSingleItem'
import useItems from '../api/useItems'
import ticksToTime from '../lib/ticksToTime'
import TrackListItem from '../components/TrackListItem'
import useQueue from '../hooks/useQueue'
import usePlayer from '../hooks/usePlayer'
import useMenu from '../hooks/useMenu'
import { cn } from '../lib/cn'
import Button from '../components/Button'
import LoadingIndicator from '../components/LoadingIndicator'
import { getBlurHashAverageColor } from 'fast-blurhash'
import cardColor from '../lib/cardColor'
import useSettings from '../hooks/useSettings'

const Album = () => {
  const { album: albumParam } = useParams()
  const client = useClient()
  const settings = useSettings()
  const queue = useQueue()
  const { play } = usePlayer()
  const { showMenu, setMenu } = useMenu()

  const album = useSingleItem(albumParam)
  const playlist = album.data?.Type === 'Playlist'
  const { data, isLoading } = useItems({
    ParentId: albumParam,
    SortBy: playlist ? undefined : 'ParentIndexNumber,IndexNumber,Name',
    Fields: 'MediaSources',
  })
  const liked = data
    ? data.Items.filter((track) => track.UserData.IsFavorite)
    : undefined

  const image = client.server + '/Items/' + albumParam + '/Images/Primary'
  const blurhash =
    album.data && !album.isLoading
      ? 'Primary' in album.data.ImageBlurHashes
        ? album.data.ImageBlurHashes.Primary[
            'Primary' in album.data.ImageTags
              ? album.data.ImageTags.Primary
              : album.data.AlbumPrimaryImageTag
          ]
        : null
      : null
  const average = blurhash ? getBlurHashAverageColor(blurhash) : null
  const color = average
    ? cardColor({ r: average[0], g: average[1], b: average[2] }, settings.dark)
    : '#f4f4f560'

  return (
    <div className="h-full px-4 pt-4">
      <div className="flex h-full gap-4">
        {album.data && !album.isLoading && data && !isLoading ? (
          <>
            <img
              src={image}
              className="round-2 aspect-square size-96 object-cover"
            />

            <div className="flex w-full flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="text-4xl font-bold">{album.data.Name}</div>
                {!playlist && (
                  <div className="text-secondary flex gap-4 text-2xl font-medium">
                    {album.data.AlbumArtists.map((artist, index) => (
                      <Link to={'/artist/' + artist.Id}>
                        {artist.Name}
                        {index < album.data.AlbumArtists.length - 1 ? ',' : ''}
                      </Link>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-4">
                    <div>
                      {album.data.ChildCount +
                        ' track' +
                        (album.data.ChildCount !== 1 ? 's' : '')}
                    </div>
                    <div>{ticksToTime(album.data.RunTimeTicks, true)}</div>
                    {'ProductionYear' in album.data && (
                      <div>{album.data.ProductionYear}</div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      icon="play_arrow"
                      filled
                      onClick={() => {
                        queue.setQueue(data.Items)
                        play()
                      }}
                    >
                      Play {playlist ? 'Playlist' : 'Album'}
                    </Button>
                    <Button
                      icon="shuffle"
                      onClick={() => {
                        queue.setQueue(
                          [...data!.Items].sort(() => Math.random() - 0.5),
                        )
                        play()
                      }}
                    >
                      Shuffle {playlist ? 'Playlist' : 'Album'}
                    </Button>
                    {liked && liked.length > 0 && (
                      <Button
                        icon="favorite"
                        filled
                        size={20}
                        onClick={() => {
                          queue.setQueue(liked)
                          play()
                        }}
                      >
                        Play Liked
                      </Button>
                    )}
                    {liked && liked.length > 0 && (
                      <Button
                        icon="shuffle"
                        filled
                        onClick={() => {
                          queue.setQueue(
                            [...liked].sort(() => Math.random() - 0.5),
                          )
                          play()
                        }}
                      >
                        Shuffle Liked
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-1">
                <AutoSizer>
                  {({ height, width }) => (
                    <FixedSizeList
                      width={width}
                      height={height}
                      itemCount={data.Items.length}
                      itemSize={72}
                      className={cn(
                        'player-padding',
                        //showMenu && 'overflow-y-hidden!',
                      )}
                    >
                      {({ index, style }) => (
                        <TrackListItem
                          item={data.Items[index]}
                          showAlbumArt={playlist}
                          showArtist={
                            playlist ||
                            data.Items[index].Artists.join() !==
                              album.data.AlbumArtist
                          }
                          showLike={playlist ? albumParam : true}
                          trackNumber={!playlist}
                          style={style}
                          onClick={() => {
                            const current = queue.trackID
                            queue.setQueue(data.Items, index)
                            if (data.Items[index].Id === current) play()
                          }}
                          onContextMenu={(e) =>
                            setMenu(e, 'track', data.Items[index])
                          }
                          playing={data.Items[index].Id === queue.trackID}
                        />
                      )}
                    </FixedSizeList>
                  )}
                </AutoSizer>
              </div>
            </div>
          </>
        ) : (
          <LoadingIndicator />
        )}
      </div>
    </div>
  )
}

export default Album
