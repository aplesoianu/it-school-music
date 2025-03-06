export const initialState = {
  artists: [],
};

export function topArtistsReducer(state, action) {
  switch (action.type) {
    case "SET_TOP_ARTISTS":
      return {
        ...state,
        artists: action.payload,
      };
    default:
      return state;
  }
}
