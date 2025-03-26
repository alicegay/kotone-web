type Base = {
  Name: string
  Search?: string
  SortName: string
  Id: string
  RunTimeTicks: number
  ImageTags: { [key: string]: string }
  ImageBlurHashes: { [key: string]: { [key: string]: string } }
}

export type Track = Base & {
  Type: 'Audio'
  CanDownload: boolean
  IndexNumber: number
  ParentIndexNumber: number
  Album: string
  AlbumId: string
  Artists: string[]
  AlbumArtist: string
  AlbumArtists: { Name: string; Id: string }[]
  AlbumPrimaryImageTag: string
  NormalizationGain: number
  Bitrate?: number
  Container?: string
}

export type Album = Base & {
  Type: 'MusicAlbum'
  ParentId: string
  ChildCount: number
  Artists: string[]
  AlbumArtist: string
  AlbumArtists: { Name: string; Id: string }[]
  NormalizationGain: number
}

export type Playlist = Base & {
  Type: 'Playlist'
  ParentId: string
  ChildCount: number
}
