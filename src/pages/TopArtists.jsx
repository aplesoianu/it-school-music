import React, { useContext } from "react";
import { TopArtistsContext } from "../store/TopArtists/context";
import ArtistsList from "../components/ArtistsList";

export default function TopArtists() {
  const { artists } = useContext(TopArtistsContext);
  
  return <ArtistsList artistsData={artists} type="artists" />;
}
