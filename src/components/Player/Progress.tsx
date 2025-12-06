import useQueue from '../../hooks/useQueue'
import usePlayer from '../../hooks/usePlayer'
import useProgress from '../../hooks/useProgress'
import secsToTime from '../../lib/secsToTime'
import useSingleItem from '../../api/useSingleItem'
import Icon from '../Icon'

const Progress = () => {
  const queue = useQueue()
  const { duration } = usePlayer()
  const { progress } = useProgress()

  const track = queue.queue[queue.track]
  const item = useSingleItem(track.Id)
  const stream =
    !!item.data && item.data.MediaStreams.length > 0
      ? item.data.MediaStreams.find((stream) => stream.Type === 'Audio')
      : undefined

  return (
    <div className="flex flex-col gap-2">
      <div className="h-1.5 w-full rounded-full bg-zinc-100/40">
        <div
          className="h-1.5 rounded-full bg-zinc-100"
          style={{ width: (progress / duration) * 100 + '%' }}
        />
      </div>
      <div className="flex flex-row justify-between">
        <div>{secsToTime(progress)}</div>
        {stream && (
          <div className="flex gap-4">
            {stream?.SampleRate >= 96000 && stream?.BitDepth >= 24 && (
              <Icon icon="high_res" filled />
            )}
            <div>{stream.Codec.toUpperCase()}</div>
            <div>{stream?.SampleRate / 1000} kHz</div>
            <div>{stream?.BitDepth}-bit</div>
            {/* <div>{Math.round(stream.BitRate / 1000)} kbps</div> */}
          </div>
        )}
        <div>{secsToTime(duration)}</div>
      </div>
    </div>
  )
}

export default Progress
