export const initialState = {
  topGenres: [],
};

export function topGenresReducer(state, action) {
  switch (action.type) {
    case "SET_TOP_GENRES":
      return {
        ...state,
        topGenres: action.payload,
      };
    default:
      return state;
  }
}
