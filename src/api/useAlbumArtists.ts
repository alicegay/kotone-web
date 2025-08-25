import { useQuery } from '@tanstack/react-query'
import { artists } from 'jellyfin-api'
import ItemsQuery from 'jellyfin-api/lib/types/queries/ItemsQuery'
import useClient from '../hooks/useClient'

const useAlbumArtists = (params: ItemsQuery, enabled: boolean = true) => {
  const client = useClient()

  return useQuery({
    queryKey: ['artists', params],
    queryFn: () => artists.albumArtists(client.api, params),
    enabled: enabled,
  })
}

export default useAlbumArtists
