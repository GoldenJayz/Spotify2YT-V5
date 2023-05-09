interface playlist {
  collaborative: boolean;
  description: string;
  external_urls: object;
  href: string;
  id: string;
  images: object[];
  name: string;
  owner: object;
  primary_color: null;
  public: boolean;
  snapshot_id: string;
  tracks: playlistTrackResponse;
  type: string;
  uri: string;
}

interface playlistResBody { 
  href: string;
  items: playlist[],
  limit: number;
  next: null;
  offset: number;
  previous: null;
  total: number;
}

interface tracksResBody { 
  href: string;
  items: trackInfo[],
  limit: number;
  next: null;
  offset: number;
  previous: null;
  total: number;
}


interface playlistItemResource {
  kind: "youtube#playlistItem";
  etag: etag;
  id: string;
  snippet: {
    publishedAt: datetime;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      (key): {
        url: string;
        width: number;
        height: number;
      };
    };
    channelTitle: string;
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
    playlistId: string;
    position: number;
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
  contentDetails: {
    videoId: string;
    startAt: string;
    endAt: string;
    note: string;
    videoPublishedAt: datetime;
  };
  status: {
    privacyStatus: string;
  };
}

interface playlistTrackResponse {
  href: string;
  total: number;
}

interface trackInfo {
  added_at: string;
  added_by: object;
  is_local: boolean;
  primary_color: null;
  track: songData;
  video_thumbnail: object;
}

interface songData {
  album: album;
  artists: artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: object;
  external_urls: object;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: object;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
}

interface album {
  artists: object[];
  available_markets: string[];
  external_urls: object;
  href: string;
  id: string;
  images: object[];
  name: string;
  release_date: string;
  release_Date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

interface artist {
  external_urls: object;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface googleToken {
  access_token: string;
  refresh_token: string | null;
  scope: string;
  token_type: string;
  expiry_date: number;
}

interface spotifyToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface userSongs {
  [key: string]: song[];
}

interface listDocRes {
  _id: string;
  id: string;
  name: string;
  spotify_refresh_token: string;
  google_refresh_token: string;
}
