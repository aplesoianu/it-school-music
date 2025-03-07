import React, { useReducer, useEffect } from "react";
import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Page404 from "./pages/Page404.jsx";
import TopGenres from "./pages/TopGenres.jsx";
import TopArtists from "./pages/TopArtists.jsx";
import Artist from "./pages/Artist.jsx";
import Favorites from "./pages/Favorites.jsx";
import { useFetch } from "./utils/hooks/useFetch.js";
import { parseArtistsData, enrichArtistInfo } from "./utils/helpers/helpers.js";
import { getEndpoint } from "./api/endpoints.js";

// Top artists
import { TopArtistsContext } from "./store/TopArtists/context.js";
import {
  initialState as topArtistsInitialState,
  topArtistsReducer,
} from "./store/TopArtists/reducer.js";
import { setTopArtists as setTopArtistsAction } from "./store/TopArtists/actions.js";

// Top genuri
import { TopGenresContext } from "./store/Genres/context";
import {
  initialState as topGenresInitialState,
  topGenresReducer,
} from "./store/Genres/reducer.js";
// Artisti favoriti

import { FavoritesContext } from "./store/Favorites/context.js";
import {
  initialState as favoritesInitialState,
  favoritesReducer,
} from "./store/Favorites/reducer.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Page404 />,
  },
  {
    path: "/favorites",
    element: <Favorites />,
  },
  {
    path: "/top-artists",
    element: <TopArtists />,
  },
  {
    path: "/top-artists/:artist",
    element: <Artist />,
    errorElement: <Page404 />,
  },
  {
    path: "/top-genres",
    element: <TopGenres />,
  },
]);

function App() {
  const [favoritesState, favoritesDispatch] = useReducer(
    favoritesReducer,
    favoritesInitialState
  );

  const [topArtistsState, topArtistsDispatch] = useReducer(
    topArtistsReducer,
    topArtistsInitialState
  );

  const [topGenresState, topGenresDispatch] = useReducer(
    topGenresReducer,
    topGenresInitialState
  );

  const topArtistsUrl = getEndpoint("topArtists");
  const { data: dataArtists } = useFetch(topArtistsUrl);

  const topGenresUrl = getEndpoint("topGenres");

  useEffect(() => {
    // Preia artistii de top si adauga info suplimentar din API si Spotify
    async function fetchAndEnrichArtists() {
      const parsedArtists = parseArtistsData(dataArtists) || [];
      const enrichedArtists = await Promise.all(
        parsedArtists.map(async (artist) => {
          try {
            const enriched = await enrichArtistInfo(artist);
            return enriched || { artist };
          } catch (e) {
            console.error("Error getting artist data:", artist.name, e);
            return { artist };
          }
        })
      );
      const validArtists = enrichedArtists.filter(
        (a) => a && a.artist && a.artist.name
      );

      // doar 75, pentru ca dureaza mult call in API
      const topList = validArtists.slice(0, 75).map((item) => ({
        ...item,
        encodedName: encodeURIComponent(item.artist.name),
      }));
      topArtistsDispatch(setTopArtistsAction(topList));
    }
    if (dataArtists) {
      fetchAndEnrichArtists();
    }
  }, [dataArtists, topArtistsDispatch]);

  useEffect(() => {
    const fetchTopGenres = async () => {
      try {
        const response = await axios.get(topGenresUrl);
        const genres = response.data.tags.tag
          .filter((genre) => genre.name.toLowerCase() !== "seen live") // seen live nu are info
          .slice(0, 15);

        // completeaza cu info suplimentar
        const enrichedGenres = await Promise.all(
          genres.map(async (genre) => {
            try {
              const genreInfoUrl = getEndpoint(
                "genreInfo",
                undefined,
                undefined,
                genre.name
              );
              const genreTopArtistsUrl = getEndpoint(
                "genreTopArtists",
                undefined,
                undefined,
                genre.name
              );

              const infoResponse = await axios.get(genreInfoUrl);
              const topArtistsResponse = await axios.get(genreTopArtistsUrl);

              return {
                ...genre,
                info: infoResponse.data.tag,
                topArtists: topArtistsResponse.data.topartists.artist,
              };
            } catch (e) {
              console.error("Error getting genre data:", genre.name, e);
              return genre;
            }
          })
        );

        topGenresDispatch({ type: "SET_TOP_GENRES", payload: enrichedGenres });
      } catch (e) {
        console.error("Error fetching top genres", e);
      }
    };

    fetchTopGenres();
  }, [topGenresUrl, topGenresDispatch]);

  const favoritesContextValue = {
    ...favoritesState,
    favoritesDispatch,
  };
  
  const topArtistsContextValue = {
    ...topArtistsState,
    dispatch: topArtistsDispatch,
  };

  const topGenresContextValue = {
    ...topGenresState,
    dispatch: topGenresDispatch,
  };

  return (
    <div className="App">
      <TopArtistsContext.Provider value={topArtistsContextValue}>
        <FavoritesContext.Provider value={favoritesContextValue}>
          <TopGenresContext.Provider value={topGenresContextValue}>
            <RouterProvider router={router} />
          </TopGenresContext.Provider>
        </FavoritesContext.Provider>
      </TopArtistsContext.Provider>
    </div>
  );
}

export default App;
