const API_KEY = "3e65da433296fe0583f5f0c74c38120a";

export function getEndpoint(category, artistId, albumId, genreName) {
  switch (category) {
    case "topArtists":
      return `https://ws.audioscrobbler.com/2.0/?method=chart.gettopartists&api_key=${API_KEY}&format=json`;
    case "topGenres":
      return `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptags&api_key=${API_KEY}&format=json`;
    case "artistInfo":
      return `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&mbid=${artistId}&api_key=${API_KEY}&format=json`;
    case "artistAlbums":
      return `https://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&mbid=${artistId}&api_key=${API_KEY}&format=json`;
    case "albumInfo":
      return `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${API_KEY}&artist=${artistId}&mbid=${albumId}&format=json`;
    case "genreInfo":
      return `http://ws.audioscrobbler.com/2.0/?method=tag.getinfo&api_key=${API_KEY}&format=json&tag=${genreName}`;
    case "genreTopArtists":
      return `http://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&api_key=${API_KEY}&format=json&tag=${genreName}`;
    default:
      return ``;
  }
}
