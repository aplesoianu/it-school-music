export function addArtistToFavorites(artist) {
  return {
    type: "ADD_TO_FAVORITES",
    payload: artist,
  };
}

export function removeArtistFromFavorites(artistId) {
  return {
    type: "REMOVE_FROM_FAVORITES",
    payload: artistId,
  };
}
