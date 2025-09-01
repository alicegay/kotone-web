import { useEffect, useRef, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { animateScroll, Element, scroller } from 'react-scroll'
import useLyrics from '../api/useLyrics'
import useQueue from '../hooks/useQueue'
import useProgress from '../hooks/useProgress'
import secsToTicks from '../lib/secsToTicks'
import { cn } from '../lib/cn'

const Lyrics = () => {
  const queue = useQueue()
  const { progress } = useProgress()
  const track = queue.queue.length > 0 ? queue.queue[queue.track] : undefined
  const lyrics = useLyrics(track ? track.Id : undefined, !!track)
  const timed = lyrics.data ? 'Start' in lyrics.data.Lyrics[0] : false
  const [follow, setFollow] = useState<boolean>(true)
  const [currentA, setCurrent] = useState<number | null>(0)
  const [current] = useDebounce(currentA, 200, { leading: true })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (timed && !!lyrics.data) {
      const position = secsToTicks(progress)
      for (let i = 0; i < lyrics.data.Lyrics.length; i++) {
        const start = lyrics.data.Lyrics[i].Start
        if (start >= position + 200_0000) {
          if (i === 0) {
            setCurrent(null)
            break
          }
          setCurrent(i - 1)
          break
        }
      }
    }
  }, [progress, lyrics.data, timed])

  useEffect(() => {
    if (
      timed &&
      follow &&
      lyrics.data &&
      current !== null &&
      current !== undefined &&
      containerRef.current
    ) {
      try {
        scroller.scrollTo(current.toString(), {
          duration: 200,
          smooth: true,
          offset: -(containerRef.current.offsetHeight / 2 - 64),
          containerId: 'lyrics',
        })
      } catch (error) {
        console.warn('Failed to scroll to lyric element:', error)
      }
    }
  }, [current, follow, timed, lyrics.data])

  useEffect(() => {
    animateScroll.scrollToTop({
      duration: 0,
      smooth: false,
      containerId: 'lyrics',
    })
  }, [track])

  return (
    <div className="flex h-full flex-col gap-4 px-4 pt-4">
      <div
        className="hover:bg-highlight round relative -left-3 mx-1 flex flex-row px-3 py-1 transition hover:cursor-pointer"
        onClick={() => {}}
      >
        <h1 className="text-3xl font-bold">Lyrics</h1>
      </div>
      {lyrics.data && !lyrics.isLoading && (
        <div
          ref={containerRef}
          id="lyrics"
          className={cn(
            'flex h-full flex-col gap-6 overflow-y-scroll pb-6',
            follow && timed && 'overflow-hidden',
          )}
        >
          {lyrics.data.Lyrics.map((lyric, index) => (
            <Element
              name={index.toString()}
              key={index}
              className={cn(
                'text-3xl',
                timed && follow && index !== current && 'text-zinc-100/60',
              )}
            >
              {lyric.Text}
            </Element>
          ))}
        </div>
      )}
    </div>
  )
}

export default Lyrics
