import { getArtistInfo } from "../../api/adaptors";

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

export async function enrichArtistInfo(artistData){
  const artistInfo = await getArtistInfo(artistData.mbid)
  return artistInfo
}