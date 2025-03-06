import React, { useReducer, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import TopGenres from "./pages/TopGenres.jsx";
import TopArtists from "./pages/TopArtists.jsx";
import Artist from "./pages/Artist.jsx";
import { useFetch } from "./utils/hooks/useFetch.js";
import { parseArtistsData, enrichArtistInfo } from "./utils/helpers/helpers.js";
import { getEndpoint } from "./api/endpoints.js";

// Favorites Context & reducer
import { FavoritesContext } from "./store/Favorites/context.js";
import {
  initialState as favoritesInitialState,
  favoritesReducer,
} from "./store/Favorites/reducer.js";

// TopArtists Context, reducer, and action
import { TopArtistsContext } from "./store/TopArtists/context.js";
import {
  initialState as topArtistsInitialState,
  topArtistsReducer,
} from "./store/TopArtists/reducer.js";
import { setTopArtists as setTopArtistsAction } from "./store/TopArtists/actions.js";

// TopGenres Provider
import { TopGenresProvider } from "./store/Genres/context.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <p>Page not found.</p>,
  },
  {
    path: "/favorites",
    element: <p>Favorites page (to be implemented)</p>,
  },
  {
    path: "/top-artists",
    element: <TopArtists />,
  },
  {
    path: "/top-artists/:artist",
    element: <Artist />,
  },
  {
    path: "/top-genres",
    element: <TopGenres />,
  },
]);

function App() {
  // Set up the reducers for favorites and top artists
  const [favoritesState, favoritesDispatch] = useReducer(
    favoritesReducer,
    favoritesInitialState
  );
  const [topArtistsState, topArtistsDispatch] = useReducer(
    topArtistsReducer,
    topArtistsInitialState
  );

  const topArtistsUrl = getEndpoint("topArtists");
  const { data } = useFetch(topArtistsUrl);

  useEffect(() => {
    async function fetchAndEnrichArtists() {
      const parsedArtists = parseArtistsData(data) || [];
      const enrichedArtists = await Promise.all(
        parsedArtists.map(async (artist) => {
          try {
            const enriched = await enrichArtistInfo(artist);
            return enriched || { artist };
          } catch (e) {
            console.error("Error enriching artist:", artist.name, e);
            return { artist };
          }
        })
      );
      const validArtists = enrichedArtists.filter(
        (a) => a && a.artist && a.artist.name
      );
      const topList = validArtists.slice(0, 15).map((item) => {
        return {
          ...item,
          encodedName: encodeURIComponent(item.artist.name),
        };
      });
      topArtistsDispatch(setTopArtistsAction(topList));
    }
    if (data) {
      fetchAndEnrichArtists();
    }
  }, [data, topArtistsDispatch]);

  // Prepare context values
  const favoritesContextValue = { favoritesState, favoritesDispatch };
  const topArtistsContextValue = {
    ...topArtistsState,
    dispatch: topArtistsDispatch,
  };

  return (
    <div className="App">
      <TopArtistsContext.Provider value={topArtistsContextValue}>
        <FavoritesContext.Provider value={favoritesContextValue}>
          <TopGenresProvider>
            <RouterProvider router={router} />
          </TopGenresProvider>
        </FavoritesContext.Provider>
      </TopArtistsContext.Provider>
    </div>
  );
}

export default App;

// click pe highlightes artist-> go to details
// daca nu se gaseste artistul in context pe TopGenres, sa se preia dinamic
// pagina de favorite cu adaugare/ stergere
// titlu aplicatie
