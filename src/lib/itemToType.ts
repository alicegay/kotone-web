import Item from 'jellyfin-api/lib/types/media/Item'
import { Album, Playlist, Track } from '../types/ItemTypes'
import formatName from './formatName'

const itemToType = (item: Item | Track): Track | Album | Playlist | Item => {
  const base = {
    Name: item.Name,
    Search: 'Search' in item ? (item.Search as string) : formatName(item.Name),
    SortName: item.SortName,
    Id: item.Id,
    RunTimeTicks: item.RunTimeTicks,
    ImageTags: item.ImageTags,
    ImageBlurHashes: item.ImageBlurHashes,
  }
  if (item.Type === 'Audio' || item.Type === 'MusicVideo') {
    const result: Track = {
      ...base,
      Type: 'Audio',
      CanDownload: item.CanDownload,
      IndexNumber: item.IndexNumber,
      ParentIndexNumber: item.ParentIndexNumber,
      Album: item.Album,
      AlbumId: item.AlbumId,
      Artists: item.Artists,
      ArtistItems: item.ArtistItems,
      AlbumArtist: item.AlbumArtist,
      AlbumArtists: item.AlbumArtists,
      AlbumPrimaryImageTag: item.AlbumPrimaryImageTag,
      NormalizationGain: item.NormalizationGain,
      Bitrate:
        'Bitrate' in item && item.Bitrate
          ? item.Bitrate
          : 'MediaSources' in item
            ? item.MediaSources[0].Bitrate
            : undefined,
      Container:
        'Container' in item && item.Container
          ? item.Container
          : 'MediaSources' in item
            ? item.MediaSources[0].Container
            : undefined,
      UserData: 'UserData' in item && item.UserData ? item.UserData : undefined,
    }
    return result
  } else if (item.Type === 'MusicAlbum') {
    const result: Album = {
      ...base,
      Type: 'MusicAlbum',
      ParentId: item.ParentId,
      ChildCount: item.ChildCount,
      Artists: item.Artists,
      AlbumArtist: item.AlbumArtist,
      AlbumArtists: item.AlbumArtists,
      NormalizationGain: item.NormalizationGain,
    }
    return result
  } else if (item.Type === 'Playlist') {
    const result: Playlist = {
      ...base,
      Type: 'Playlist',
      ParentId: item.ParentId,
      ChildCount: item.ChildCount,
    }
    return result
  } else {
    return item
  }
}

export default itemToType
