export const initialState = {
  artists: [],
};

export function favoritesReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_FAVORITES": {
      const newArtist = action.payload;
      const alreadyAdded = state.artists.some((artist) => {
        return artist.artist.mbid === newArtist.artist.mbid;
      });
      if (alreadyAdded) {
        return state;
      }
      return {
        ...state,
        artists: [newArtist, ...state.artists],
      };
    }

    case "REMOVE_FROM_FAVORITES": {
      return {
        ...state,
        artists: state.artists.filter((artist) => {
          return artist.artist.mbid !== action.payload;
        }),
      };
    }
    default:
      return state;
  }
}
