import React, { useContext } from "react";
import { TopGenresContext } from "../store/Genres/context";
import Layout from "../components/Layout";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function TopGenres() {
  const { topGenres, loading, error } = useContext(TopGenresContext);

  if (loading) return <p>Loading genres...</p>;
  if (error) return <p>Error loading genres.</p>;

  return (
    <Layout>
      <Container className="my-5">
        <h1 className="text-center mb-4">Top Genres</h1>
        <Row>
          {topGenres.map((genre, index) => (
            <Col md={4} sm={6} xs={12} key={index} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{genre.name}</Card.Title>
                  <Card.Text>
                    {genre.info && genre.info.wiki && genre.info.wiki.summary
                      ? genre.info.wiki.summary.split("<a")[0]
                      : "No info available."}
                  </Card.Text>
                  <Card.Text>
                    <small className="text-muted">
                      Reach: {genre.reach} | Taggings: {genre.taggings}
                    </small>
                  </Card.Text>
                  {genre.topArtists && genre.topArtists.length > 0 && (
                    <div className="mt-3">
                      <h6>Top Artists:</h6>
                      <ListGroup variant="flush">
                        {genre.topArtists.slice(0, 3).map((artist, idx) => (
                          <ListGroup.Item key={idx}>
                            <Link to={`/top-artists/${artist.name}`}>
                              {artist.name}
                            </Link>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  )}
                </Card.Body>
                <Card.Footer>
                  <a
                    href={genre.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Last.fm
                  </a>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Layout>
  );
}
