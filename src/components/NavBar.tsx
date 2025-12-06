import { useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useDebouncedCallback } from 'use-debounce'
import useClient from '../hooks/useClient'
import useSettings from '../hooks/useSettings'
import useSearch from '../hooks/useSearch'
import Icon from './Icon'
import { cn } from '../lib/cn'
import isDesktop from '../lib/isDesktop'

const NavBar = () => {
  const client = useClient()
  const settings = useSettings()
  const navigate = useNavigate()
  const location = useLocation()
  const search = useSearch()

  const searchRef = useRef<HTMLInputElement>(null)
  const setQuery = useDebouncedCallback((query: string) => {
    if (query) {
      search.setQuery(query)
      navigate('/search', {
        replace: location.pathname.split('/')[1] === 'search',
      })
    }
  }, 200)

  return (
    <div className="desktop-drag flex">
      {isDesktop() && <div className="w-20" />}
      <div className="flex flex-1 justify-between gap-8 px-6 py-2">
        <div className="flex items-center gap-4">
          <Icon
            icon="arrow_back"
            onClick={() => {
              navigate(-1)
            }}
            className="hover:cursor-pointer"
          />
          <Icon
            icon="home"
            onClick={() => {
              navigate('/')
            }}
            filled
            className="hover:cursor-pointer"
          />
          <Icon
            icon="album"
            onClick={() => {
              navigate('/albums')
            }}
            className="hover:cursor-pointer"
          />
          <Icon
            icon="music_note"
            onClick={() => {
              navigate('/tracks')
            }}
            className="hover:cursor-pointer"
          />
          <Icon
            icon="artist"
            filled
            onClick={() => {
              navigate('/artists')
            }}
            className="hover:cursor-pointer"
          />
        </div>

        <div className="flex grow items-center">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search..."
            className="bg-w text-b desktop-no-drag grow rounded-l-2xl px-4 py-1.5"
            onChange={(e) => setQuery(e.target.value)}
          />
          <div
            className="bg-w text-b flex h-full items-center px-2 hover:cursor-pointer"
            onClick={() => {
              if (searchRef.current) searchRef.current.value = ''
              searchRef.current?.focus()
            }}
          >
            <Icon icon="close" />
          </div>
          <div
            className="bg-w text-b flex h-full items-center rounded-r-2xl px-2 hover:cursor-pointer"
            onClick={() => {
              const query = searchRef.current!.value
              if (query) {
                search.setQuery(query)
                navigate('/search')
              }
            }}
          >
            <Icon icon="search" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Icon
            icon="logout"
            onClick={() => {
              client.signout()
            }}
            className="hover:cursor-pointer"
          />
          <Icon icon="settings" onClick={() => navigate('/settings')} />
        </div>

        {(process.env.NODE_ENV === 'development' ||
          import.meta.env.VITE_SHOW_COMMIT) && (
          <div className="flex items-center font-mono text-sm">
            {__COMMMIT_HASH__}
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBar
