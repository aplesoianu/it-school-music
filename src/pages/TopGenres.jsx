import React, { useContext } from "react";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { TopGenresContext } from "../store/Genres/context";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";
import "./TopGenres.css";

export default function TopGenres() {
  const { topGenres } = useContext(TopGenresContext);

  return (
    <Layout>
      <Container className="my-5">
        <h1 className="text-center mb-4">Top Genres</h1>
        <Row>
          {topGenres.map((genre, index) => (
            <Col md={4} sm={6} xs={12} key={index} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="genre-title">{genre.name}</Card.Title>
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
                            <Button
                              as={Link}
                              to={`/top-artists/${artist.name}`}
                              variant="outline-primary"
                              className="artist-button"
                              block="true"
                            >
                              {artist.name}
                            </Button>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </div>
                  )}
                </Card.Body>
                <Card.Footer>
                  <a href={genre.url} target="_blank" rel="noopener noreferrer">
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
