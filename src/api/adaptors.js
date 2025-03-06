import axios from "axios";
import { getEndpoint } from "./endpoints";

export async function getSpotifyToken() {
  const CLIENT_ID = "5ac6afed4a514a0cbb0644cca594a99c";
  const CLIENT_SECRET = "14b328ed53354ae8b623c532a83f3379";

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    headers: {
      Authorization: "Basic " + btoa(`${CLIENT_ID}:${CLIENT_SECRET}`),
    },
    data: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  };

  return axios(authOptions)
    .then((response) => response.data.access_token)
    .catch((error) => {
      throw new Error("Failed to retrieve access token");
    });
}

export async function getSpotifyArtistPicture(artistName, accessToken) {
  const searchParams = new URLSearchParams({
    q: artistName,
    type: "artist",
  });

  const searchResponse = await fetch(
    `https://api.spotify.com/v1/search?${searchParams}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const searchData = await searchResponse.json();

  if (searchData.artists.items.length > 0) {
    const artist = searchData.artists.items[0];
    if (artist.images.length > 0) {
      const imageUrl = artist.images[0].url;
      console.log(`Image URL: ${imageUrl}`);
      return imageUrl;
    } else {
      console.log("No image available for this artist.");
      return null;
    }
  } else {
    console.log("Artist not found.");
    return null;
  }
}

export async function getArtistInfo(artistId) {
  const endpointInfo = getEndpoint("artistInfo", artistId);
  const endpointAlbums = getEndpoint("artistAlbums", artistId);

  try {
    const [infoResponse, albumsResponse] = await Promise.all([
      axios.get(endpointInfo),
      axios.get(endpointAlbums),
    ]);

    let enrichedArtist = {
      ...infoResponse.data,
      albums: albumsResponse.data,
    };

    const token = await getSpotifyToken();
    if (token && enrichedArtist.artist && enrichedArtist.artist.name) {
      const spotifyPicture = await getSpotifyArtistPicture(
        enrichedArtist.artist.name,
        token
      );
      enrichedArtist.artist.spotifyPicture = spotifyPicture;
    }

    return enrichedArtist;
  } catch (error) {
    throw new Error("Nu s-au gasit informatii");
  }
}
