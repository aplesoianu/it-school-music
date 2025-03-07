import React, { useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { addArtistToFavorites } from "../store/Favorites/actions";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import { FavoritesContext } from "../store/Favorites/context";

export default function ArtistsList({ artistsData, type }) {
  const { favoritesDispatch } = useContext(FavoritesContext);

  // pentru favoriti nu exista limita de artisti afisati
  const itemsToDisplay =
    type === "artists" ? artistsData.slice(0, 18) : artistsData;

  return (
    <Layout>
      <Container className="my-5">
        <h1 className="text-center mb-4">
          {type === "favorites" ? "Favorite Artists" : "Top Artists"}
        </h1>
        <Row>
          {itemsToDisplay.map((item, index) => {
            const artist = item.artist;
            const imageUrl =
              artist.spotifyPicture
            const genreNames =
              artist.tags && artist.tags.tag
                ? Array.isArray(artist.tags.tag)
                  ? artist.tags.tag.map((g) => g.name).join(", ")
                  : artist.tags.tag.name
                : "No genres available";
            const bioSnippet =
              artist.bio && artist.bio.summary
                ? artist.bio.summary.split("<a")[0]
                : "No bio available.";

            return (
              <Col md={4} sm={6} xs={12} key={index} className="mb-4">
                <Card className="h-100 shadow-sm">
                  {imageUrl && (
                    <Card.Img variant="top" src={imageUrl} alt={artist.name} />
                  )}
                  <Card.Body>
                    <Card.Title>
                      <strong>{artist.name}</strong>
                    </Card.Title>
                    <Card.Text>
                      <strong>Genres:</strong> {genreNames}
                    </Card.Text>
                    <Card.Text>{bioSnippet}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-between align-items-center">
                    <Button
                      variant="outline-dark"
                      as={Link}
                      to={`/top-artists/${encodeURIComponent(artist.name)}`}
                    >
                      View Details
                    </Button>
                    {type === "favorites" ? (
                      <Button
                        variant="danger"
                        onClick={() =>
                          favoritesDispatch({
                            type: "REMOVE_FROM_FAVORITES",
                            payload: artist.mbid,
                          })
                        }
                      >
                        Remove from Favorites
                      </Button>
                    ) : (
                      <Button
                        variant="success"
                        onClick={() =>
                          favoritesDispatch(addArtistToFavorites(item))
                        }
                      >
                        Add to Favorites
                      </Button>
                    )}
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </Layout>
  );
}
