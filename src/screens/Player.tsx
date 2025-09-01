import { useNavigate, useParams } from 'react-router'
import useClient from '../hooks/useClient'
import useQueue from '../hooks/useQueue'
import usePlayer from '../hooks/usePlayer'
import useDimensions from '../hooks/useDimensions'
import useFavItem from '../api/useFavItem'
import useLyrics from '../api/useLyrics'
import Button from '../components/Player/Button'
import Progress from '../components/Player/Progress'
import Queue from './Queue'
import Lyrics from './Lyrics'
import useMenu from '../hooks/useMenu'

const Player = () => {
  const client = useClient()
  const queue = useQueue()
  const player = usePlayer()
  const { width, height } = useDimensions()
  const navigate = useNavigate()
  const { screen } = useParams()
  const { setMenu } = useMenu()

  const track = queue.queue.length > 0 ? queue.queue[queue.track] : undefined
  const favorite = track && track.UserData.IsFavorite
  const favItem = useFavItem(
    track ? track.Id : undefined,
    track ? track.AlbumId : undefined,
  )
  const lyrics = useLyrics(track ? track.Id : undefined, !!track)
  const timedLyrics = lyrics.data ? 'Start' in lyrics.data.Lyrics[0] : false

  const image = track
    ? 'Primary' in track.ImageTags
      ? client.server + '/Items/' + track.Id + '/Images/Primary'
      : 'AlbumPrimaryImageTag' in track && track.AlbumPrimaryImageTag
        ? client.server + '/Items/' + track.AlbumId + '/Images/Primary'
        : null
    : null
  const maxImageSize = Math.min(width / 2, (height / 10) * 4.5)

  return track ? (
    <div className="text-w flex h-full flex-row">
      <div className="flex flex-1 flex-col items-center p-4">
        <div
          className="flex flex-1 flex-col gap-4"
          style={{
            maxWidth: maxImageSize,
          }}
        >
          <img
            src={image!}
            className="round-2 aspect-square object-cover"
            style={{
              maxWidth: maxImageSize,
              maxHeight: maxImageSize,
            }}
          />

          <div className="flex flex-col gap-2">
            <h1 className="line-clamp-2 text-3xl font-bold">{track.Name}</h1>
            <h2 className="line-clamp-2 text-2xl font-medium text-zinc-100/60">
              {track.Artists.join(', ')}
            </h2>
            {track.Name !== track.Album && (
              <h3 className="line-clamp-2 text-lg font-medium text-zinc-100/60">
                {track.Album}
              </h3>
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <Progress />

            <div className="flex flex-row items-center justify-evenly">
              <Button
                icon="skip_previous"
                size={48}
                filled
                onClick={() => queue.prevTrack()}
              />
              <Button
                icon={player.isPlaying ? 'pause' : 'play_arrow'}
                size={72}
                filled
                onClick={() => player.playpause()}
              />
              <Button
                icon="skip_next"
                size={48}
                filled
                onClick={() => queue.nextTrack()}
              />
            </div>

            <div className="flex flex-row items-center justify-evenly">
              {screen === 'lyrics' ? (
                <Button
                  icon="queue_music"
                  onClick={() => navigate('/player', { replace: true })}
                />
              ) : (
                <Button
                  icon="lyrics"
                  off={!lyrics.data}
                  onClick={() => navigate('/player/lyrics', { replace: true })}
                />
              )}
              <Button
                icon={queue.repeat === 'track' ? 'repeat_one' : 'repeat'}
                off={queue.repeat === 'off'}
                onClick={() => queue.cycleRepeat()}
              />
              <Button
                icon="favorite"
                filled={favorite}
                off={!favorite}
                onClick={() => favItem.mutate(favorite)}
              />
              <Button
                icon="more_vert"
                onClick={(e) =>
                  setTimeout(() => setMenu(e, 'track', track), 10)
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        {screen === 'lyrics' ? <Lyrics /> : <Queue />}
      </div>
    </div>
  ) : (
    <div></div>
  )
}

export default Player
