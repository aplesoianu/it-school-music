import React, { useContext } from "react";
import { Container } from "react-bootstrap";
import { FavoritesContext } from "../store/Favorites/context";
import Layout from "../components/Layout";
import ArtistsList from "../components/ArtistsList";

export default function Favorites() {
  const { artists } = useContext(FavoritesContext);
  
  if (!artists || artists.length === 0) {
    return (
      <Layout>
        <Container className="my-5">
          <h1 className="text-center mb-4">Favorites</h1>
          <p>No favorites added.</p>
        </Container>
      </Layout>
    );
  }

  return <ArtistsList artistsData={artists} type="favorites" />;
}
