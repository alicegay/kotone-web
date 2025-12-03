import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router'
import useSettings from '../hooks/useSettings'
import { cn } from '../lib/cn'
import { UAParser } from 'ua-parser-js'
import useClient from '../hooks/useClient'
import isDesktop from '../lib/isDesktop'

const LayoutExt = () => {
  const settings = useSettings()
  const client = useClient()
  const navigate = useNavigate()
  const location = useLocation()
  const { server: serverParam } = useParams()
  const { browser } = UAParser(window.navigator.userAgent)
  const playerScreen = location.pathname.split('/')[1] === 'player'
  const setupScreen =
    location.pathname.split('/')[1] === 'server' ||
    location.pathname.split('/')[1] === 'signin'

  useEffect(() => {
    if (client.hasHydrated) {
      if (client.client) {
        if (
          location.pathname === '/server' ||
          location.pathname.startsWith('/signin')
        )
          navigate('/')
      } else if (
        !client.client &&
        client.server &&
        client.user &&
        client.token
      ) {
        resetClient()
      } else {
        if (import.meta.env.VITE_SERVER) {
          navigate('/signin')
        } else if (!serverParam) {
          navigate('/server')
        }
      }
    }
  }, [client.hasHydrated, client.client])

  const resetClient = async () => {
    const clientName = 'Kotone Web'
    const deviceName = browser.name ?? 'Unknown'
    const deviceID = client.deviceID
    const clientVer = '1.0.0'
    client.setClient({
      server: client.server!,
      clientName: clientName,
      deviceName: deviceName,
      deviceID: deviceID,
      version: clientVer,
      user: client.user!,
      token: client.token!,
    })
    console.log('CLIENT RESET')
  }

  return (
    <div
      className={cn(
        'text-primary flex h-screen',
        (settings.dark || playerScreen || setupScreen) && 'dark',
        isDesktop() && 'desktop-corner',
      )}
    >
      <Outlet />
    </div>
  )
}

export default LayoutExt
