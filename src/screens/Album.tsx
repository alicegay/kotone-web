import { useParams } from 'react-router'
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

const Album = () => {
  const { album: albumParam } = useParams()
  const client = useClient()
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
                <div className="text-secondary text-2xl font-medium">
                  {album.data.AlbumArtist}
                </div>
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
                        showMenu && 'overflow-y-hidden!',
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
