export default class Song {
	public songName: string;
	public artist: string;
	public album: string;

	public constructor(songName: string, artist: string, album: string) {
		this.songName = songName;
		this.artist = artist;
		this.album = album;
	}

	public getSearchName(): string {
		return `${this.songName} ${this.artist}`;
	}
}
