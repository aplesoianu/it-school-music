import { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import Layout from "../components/Layout";
import { getEndpoint } from "../api/endpoints";
import { useFetch } from "../utils/hooks/useFetch.js";
import { getAlbumInfo } from "../api/adaptors.js";
import {
  parseArtistsData,
  enrichArtistInfo,
} from "../utils/helpers/helpers.js";

export default function Home() {
  const topArtistsUrl = getEndpoint("topArtists");
  const { data } = useFetch(topArtistsUrl);
  const [highlightedArtist, setHighlightedArtist] = useState(null);
  const [highlightedAlbum, setHighlightedAlbum] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topArtists = parseArtistsData(data);
        if (topArtists) {
          console.log(topArtists)
          const topArtist = topArtists[0];
          const enrichedArtist = await enrichArtistInfo(topArtist);
          setHighlightedArtist(enrichedArtist);
          console.log(enrichedArtist)
          if (
            enrichedArtist.albums &&
            enrichedArtist.albums.topalbums &&
            enrichedArtist.albums.topalbums.album &&
            enrichedArtist.albums.topalbums.album.length > 0
          ) {
            const albumObj =
              enrichedArtist.albums.topalbums.album[1] ||
              enrichedArtist.albums.topalbums.album[0];
            const albumInfo = await getAlbumInfo(
              topArtist.name,
              albumObj.mbid || albumObj.name
            );
            setHighlightedAlbum(albumInfo);
          }
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
        <Row className="mb-5">
          {/* Highlighted Artist Section */}
          <Col md={6}>
            <h2 className="text-center text-primary mb-3">Highlighted Artist</h2>
            {highlightedArtist ? (
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  {/* Artist Name above the image */}
                  <Card.Title className="text-center">
                    {highlightedArtist.artist.name}
                  </Card.Title>
                  <img
                    src={
                      highlightedArtist.artist.spotifyPicture ||
                      highlightedArtist.artist.image[3]["#text"] ||
                      highlightedArtist.artist.image[0]["#text"]
                    }
                    alt={highlightedArtist.artist.name}
                    className="img-fluid mb-3"
                  />
                  <Card.Text>
                    <strong>Last Week Plays:</strong>{" "}
                    {highlightedArtist.artist.stats.playcount}
                  </Card.Text>
                  <Card.Text>
                    <strong>About:</strong>{" "}
                    {highlightedArtist.artist.bio.summary}
                  </Card.Text>
                  <Card.Subtitle className="mb-2 text-muted">
                    Main Genres
                  </Card.Subtitle>
                  <ListGroup variant="flush">
                    {highlightedArtist.artist.tags.tag.map((tag, i) => (
                      <ListGroup.Item key={i}>{tag.name}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            ) : (
              <p className="text-center">Loading artist info...</p>
            )}
          </Col>

          {/* Highlighted Album Section */}
          <Col md={6}>
            <h2 className="text-center text-primary mb-3">Highlighted Album</h2>
            {highlightedAlbum ? (
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  {/* Album Name above the image */}
                  <Card.Title className="text-center">
                    {highlightedAlbum.album.name}
                  </Card.Title>
                  <img
                    src={
                      highlightedAlbum.album.image[3]["#text"] ||
                      highlightedAlbum.album.image[0]["#text"]
                    }
                    alt={highlightedAlbum.album.name}
                    className="img-fluid mb-3"
                  />
                  <Card.Text>
                    <strong>Release Year:</strong>{" "}
                    {highlightedAlbum.album.wiki && highlightedAlbum.album.wiki.published
                      ? new Date(highlightedAlbum.album.wiki.published).getFullYear()
                      : "Unknown"}
                  </Card.Text>
                  <Card.Text>
                    <strong>About:</strong>{" "}
                    {highlightedAlbum.album.wiki && highlightedAlbum.album.wiki.summary
                      ? highlightedAlbum.album.wiki.summary
                      : "No description available."}
                  </Card.Text>
                  <Card.Subtitle className="mb-2 text-muted">
                    Track List
                  </Card.Subtitle>
                  <ListGroup variant="flush">
                    {highlightedAlbum.album.tracks.track.map((track, i) => (
                      <ListGroup.Item key={i}>{track.name}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            ) : (
              <p className="text-center">Loading album info...</p>
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
