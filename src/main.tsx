import { scan } from 'react-scan'
scan({
  enabled: process.env.NODE_ENV === 'development',
})

import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './index.css'
import LayoutExt from './screens/LayoutExt'
import Splash from './screens/Splash'
import Server from './screens/Server'
import Signin from './screens/Signin'

import Layout from './screens/Layout'
import Home from './screens/Home'
import Album from './screens/Album'
import AlbumList from './screens/AlbumList'
import TrackList from './screens/TrackList'
import FrequentlyPlayed from './screens/FrequentlyPlayed'
import RecentlyPlayed from './screens/RecentlyPlayed'
import Search from './screens/Search'
import Player from './screens/Player'
import Settings from './screens/Settings'
import NotFound from './screens/NotFound'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route element={<LayoutExt />}>
          <Route path="server" element={<Server />} />
          <Route path="signin/:server?" element={<Signin />} />

          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="albums" element={<AlbumList />} />
            <Route path="album/:album" element={<Album />} />
            <Route path="playlists" element={<AlbumList />} />
            <Route path="playlist/:album" element={<Album />} />
            {/* <Route path="artists" element={<ArtistList />} />
            <Route path="artist/:artist" element={<Artist />} /> */}
            <Route path="tracks" element={<TrackList />} />
            <Route path="frequentlyplayed" element={<FrequentlyPlayed />} />
            <Route path="recentlyplayed" element={<RecentlyPlayed />} />
            <Route path="search" element={<Search />} />
            <Route path="player/:screen?" element={<Player />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route index element={<Splash />} />
        </Route>
      </Routes>
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
)
