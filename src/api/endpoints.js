import axios from "axios";
const API_KEY = "3e65da433296fe0583f5f0c74c38120a";

export function getEndpoint(category) {
  switch (category) {
    case "topArtists":
      return `http://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json`;
    case "topGenres":
      return `http://ws.audioscrobbler.com/2.0/?method=chart.gettoptags&api_key=${API_KEY}&format=json`;

    default:
      return ``;
  }
}

export function getArtistDetails(artistMBID) {
  return ``;
}
const SPOTIFY_CLIENT_ID = "5ac6afed4a514a0cbb0644cca594a99c";
const SPOTIFY_CLIENT_SECRET = "14b328ed53354ae8b623c532a83f3379";

export async function getSpotifyToken() {

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    headers: {
      Authorization: "Basic " + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`), 
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
