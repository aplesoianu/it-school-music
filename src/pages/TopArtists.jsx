import React, { useContext } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { TopArtistsContext } from "../store/TopArtists/context";
import { FavoritesContext } from "../store/Favorites/context";
import { addArtistToFavorites } from "../store/Favorites/actions";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

export default function TopArtists() {
  const { artists } = useContext(TopArtistsContext);
  const { favoritesDispatch } = useContext(FavoritesContext);

  return (
    <Layout>
      <Container className="my-5">
        <h1 className="text-center mb-4">Top Artists</h1>
        <Row>
          {artists.map((item, index) => {
            const artistData = item.artist;
            const imageUrl =
              artistData.spotifyPicture ||
              (artistData.image &&
                artistData.image.find((img) => img.size === "extralarge")?.[
                  "#text"
                ]) ||
              "";
            const genreNames =
              artistData.tags && artistData.tags.tag
                ? Array.isArray(artistData.tags.tag)
                  ? artistData.tags.tag.map((g) => g.name).join(", ")
                  : artistData.tags.tag.name
                : "No genres available";
            const bioSnippet =
              artistData.bio && artistData.bio.summary
                ? artistData.bio.summary.split("<a")[0]
                : "No bio available.";

            return (
              <Col md={4} sm={6} xs={12} key={index} className="mb-4">
                <Card className="h-100 shadow-sm">
                  {imageUrl && (
                    <Card.Img
                      variant="top"
                      src={imageUrl}
                      alt={artistData.name}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{artistData.name}</Card.Title>
                    <Card.Text>
                      <strong>Genres:</strong> {genreNames}
                    </Card.Text>
                    <Card.Text>{bioSnippet}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-between align-items-center">
                    <Link
                      to={`/top-artists/${encodeURIComponent(artistData.name)}`}
                      className="btn btn-link p-0"
                    >
                      View Details
                    </Link>
                    <Button
                      variant="primary"
                      onClick={() =>
                        favoritesDispatch(
                          addArtistToFavorites({
                            id: artistData.mbid || artistData.name,
                            name: artistData.name,
                            url: artistData.url,
                          })
                        )
                      }
                    >
                      Add to Favorites
                    </Button>
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
