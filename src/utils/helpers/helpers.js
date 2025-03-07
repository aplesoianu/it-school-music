import { getArtistInfo } from "../../api/adaptors";

// raspunsul din API vine wrapped de mai multe ori
export function parseArtistsData(artistsResponse) {
  if (!artistsResponse) return null;

  if (
    artistsResponse.artists &&
    artistsResponse.artists.artist &&
    artistsResponse.artists.artist.length > 0
  ) {
    return artistsResponse.artists.artist;
  }

  return null;
}

// pentru adaugarea de informatii suplimentare din alte rute API si din Spotify
export async function enrichArtistInfo(artistData) {
  const artistInfo = await getArtistInfo(artistData.mbid);
  return artistInfo;
}
