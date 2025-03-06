import { getArtistInfo } from "../../api/adaptors";

export function parseArtistsData(artistsResponse) {
  if (!artistsResponse) return null;

  if (
    artistsResponse.artists &&
    artistsResponse.artists.artist &&
    artistsResponse.artists.artist.length > 0
  ) {
    console.log("artists there");
    return artistsResponse.artists.artist;
  }

  return null;
}

export async function enrichArtistInfo(artistData){
  console.log(artistData.mbid)
  const artistInfo = await getArtistInfo(artistData.mbid)
  return artistInfo
}