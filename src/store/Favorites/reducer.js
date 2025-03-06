export const initialState = {
  artists: [],
};

export function favoritesReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_FAVORITES": {
      const isInList = state.artists.find(
        (artist) => artist.id === action.payload.id
      );
      if (isInList) {
        return state;
      }
      return {
        ...state, 
        artists: [action.payload, ...state.artists],
      };
    }

    case "REMOVE_FROM_FAVORITES": {
      const filteredArtists = state.artists.filter(
        (artist) => artist.id !== action.payload
      );
      return {
        ...state,
        artists: filteredArtists,
      };
    }

    default:
      return state;
  }
}
