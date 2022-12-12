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

interface playlistTrackResponse {
  href: string;
  total: number;
}

interface trackInfo {
  added_at: string;
  added_by: object;
  is_local: boolean;
  primary_color: null;
  track: object;
  video_thumbnail: object;
}

interface songData {
  album: string;

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
