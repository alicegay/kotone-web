import { useMutation, useQueryClient } from '@tanstack/react-query'
import useClient from '../hooks/useClient'
import useQueue from '../hooks/useQueue'
import useLibrary from '../hooks/useLibrary'
import { users } from 'jellyfin-api'
import Item from 'jellyfin-api/lib/types/media/Item'
import ItemsList from 'jellyfin-api/lib/types/media/ItemsList'

const useFavItem = (itemId: string, albumId: string) => {
  const client = useClient()
  const queryClient = useQueryClient()
  const { like: likeInQueue } = useQueue()
  const { likeTrack: likeInLibrary } = useLibrary()

  return useMutation({
    mutationFn: (del?: boolean) => {
      if (del) {
        return users.favoriteItemsDel(client, itemId)
      } else {
        return users.favoriteItems(client, itemId)
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['item', itemId], (oldData: Item) =>
        oldData ? { ...oldData, UserData: data } : oldData,
      )
      queryClient.setQueriesData(
        { queryKey: ['items', { ParentId: albumId }], exact: false },
        (oldData: ItemsList) => {
          const index = oldData.Items.findIndex((i) => i.Id === itemId)
          const newData = oldData
          newData.Items[index].UserData = data
          return newData
        },
      )
      likeInQueue(itemId, data.IsFavorite)
      likeInLibrary(itemId, data.IsFavorite)
    },
  })
}

export default useFavItem
