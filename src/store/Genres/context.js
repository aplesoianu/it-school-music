import React, { createContext, useState, useEffect } from "react";
import { getEndpoint } from "../../api/endpoints";
import axios from "axios";

export const TopGenresContext = createContext();

export const TopGenresProvider = ({ children }) => {
  const [topGenres, setTopGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopGenres = async () => {
      try {
        const url = getEndpoint("topGenres");
        const response = await axios.get(url);
        // Filter out the "seen live" genre and limit to 15 genres
        const genres = response.data.tags.tag
          .filter((genre) => genre.name.toLowerCase() !== "seen live")
          .slice(0, 15);

        const enrichedGenres = await Promise.all(
          genres.map(async (genre) => {
            try {
              // Get genre info and top artists URLs
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
              return genre;
            }
          })
        );

        setTopGenres(enrichedGenres);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopGenres();
  }, []);

  return (
    <TopGenresContext.Provider value={{ topGenres, loading, error }}>
      {children}
    </TopGenresContext.Provider>
  );
};
