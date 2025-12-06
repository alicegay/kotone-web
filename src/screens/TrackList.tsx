import AutoSizer from 'react-virtualized-auto-sizer'
import { FixedSizeList } from 'react-window'
import useLibrary from '../hooks/useLibrary'
import useQueue from '../hooks/useQueue'
import { cn } from '../lib/cn'
import TrackListItem from '../components/TrackListItem'
import Item from 'jellyfin-api/lib/types/media/Item'
import usePlayer from '../hooks/usePlayer'
import useMenu from '../hooks/useMenu'
import Button from '../components/Button'
import LoadingIndicator from '../components/LoadingIndicator'

const TrackList = () => {
  const { tracks } = useLibrary()
  const queue = useQueue()
  const { play } = usePlayer()
  const { showMenu, setMenu } = useMenu()

  const liked = tracks
    ? tracks.filter((track) => track.UserData.IsFavorite)
    : undefined

  return (
    <div className="flex h-full flex-col gap-4 pt-4">
      {tracks ? (
        <>
          <div className="flex flex-col gap-2 px-4">
            <div className="text-4xl font-bold">Tracks</div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-4">
                <div>
                  {tracks.length + ' track' + (tracks.length !== 1 ? 's' : '')}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  icon="play_arrow"
                  filled
                  onClick={() => {
                    queue.setQueue(tracks)
                    play()
                  }}
                >
                  Play All
                </Button>
                <Button
                  icon="shuffle"
                  onClick={() => {
                    queue.setQueue([...tracks].sort(() => Math.random() - 0.5))
                    play()
                  }}
                >
                  Shuffle All
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
                      queue.setQueue([...liked].sort(() => Math.random() - 0.5))
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
                  itemCount={tracks.length}
                  itemSize={72}
                  className={cn(
                    'player-padding',
                    //showMenu && 'overflow-y-hidden!',
                  )}
                >
                  {({ index, style }) => (
                    <TrackListItem
                      item={tracks[index] as Item}
                      showAlbumArt
                      showArtist
                      style={{ paddingLeft: 8, paddingRight: 8, ...style }}
                      onClick={() => {
                        const current = queue.trackID
                        queue.setQueue([tracks[index]], 0)
                        if (tracks[index].Id === current) play()
                      }}
                      onContextMenu={(e) => setMenu(e, 'track', tracks[index])}
                      playing={tracks[index].Id === queue.trackID}
                      showLike
                    />
                  )}
                </FixedSizeList>
              )}
            </AutoSizer>
          </div>
        </>
      ) : (
        <LoadingIndicator />
      )}
    </div>
  )
}

export default TrackList
