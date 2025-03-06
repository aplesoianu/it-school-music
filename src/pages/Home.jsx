import { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import Layout from "../components/Layout";
import { getEndpoint } from "../api/endpoints";
import { useFetch } from "../utils/hooks/useFetch.js";
import { parseArtistsData, enrichArtistInfo } from "../utils/helpers/helpers.js";

export default function Home() {
  const topArtistsUrl = getEndpoint("topArtists");
  const { data } = useFetch(topArtistsUrl);
  const [artistInfo, setArtistInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topArtists = parseArtistsData(data);
        if (topArtists) {
          const topArtist = topArtists[0];
          console.log("Top Artist:", topArtist);
          console.log("Enriching artist info...");
          const enrichedArtist = await enrichArtistInfo(topArtist);
          setArtistInfo(enrichedArtist);
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
      }
    };

    fetchData();
  }, [data]);

  return (
    <Layout>
      <Container className="mt-4">
        <Row>
          {/* Highlighted Artist */}
          <Col md={6}>
            {artistInfo ? (
              <Card className="mb-4">
                <Card.Img
                  variant="top"
                  src={
                    artistInfo.artist.spotifyPicture ||
                    artistInfo.artist.image[3]["#text"] ||
                    artistInfo.artist.image[0]["#text"]
                  }
                  alt={artistInfo.artist.name}
                />
                <Card.Body>
                  <Card.Title>{artistInfo.artist.name}</Card.Title>
                  <Card.Text>
                    <strong>Last Week Plays:</strong>{" "}
                    {artistInfo.artist.stats.playcount}
                  </Card.Text>
                  <Card.Text>
                    <strong>About:</strong> {artistInfo.artist.bio.summary}
                  </Card.Text>
                  <Card.Subtitle className="mb-2 text-muted">
                    Main Genres
                  </Card.Subtitle>
                  <ListGroup variant="flush">
                    {artistInfo.artist.tags.tag.map((tag, i) => (
                      <ListGroup.Item key={i}>{tag.name}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            ) : (
              <p>Loading artist info...</p>
            )}
          </Col>

          {/* Highlighted Album */}
          <Col md={6}>
            <Card className="mb-4">
              <Card.Img variant="top" src="ALBUM_COVER_URL" alt="Album Cover" />
              <Card.Body>
                <Card.Title>Highlighted Album</Card.Title>
                <Card.Text>Album Name (Release Year)</Card.Text>
                <Card.Text>
                  <strong>About:</strong> Short album info...
                </Card.Text>
                <Card.Subtitle className="mb-2 text-muted">
                  Track List
                </Card.Subtitle>
                <ListGroup variant="flush">
                  <ListGroup.Item>Track 1</ListGroup.Item>
                  <ListGroup.Item>Track 2</ListGroup.Item>
                  <ListGroup.Item>Track 3</ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
