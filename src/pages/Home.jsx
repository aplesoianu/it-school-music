import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { getEndpoint } from "../api/endpoints";
import { useFetch } from "../utils/hooks/useFetch.js";
import { getAlbumInfo } from "../api/adaptors.js";
import {
  parseArtistsData,
  enrichArtistInfo,
} from "../utils/helpers/helpers.js";
import Layout from "../components/Layout";

export default function Home() {
  const topArtistsUrl = getEndpoint("topArtists");
  const { data } = useFetch(topArtistsUrl);
  const [highlightedArtist, setHighlightedArtist] = useState(null);
  const [highlightedAlbum, setHighlightedAlbum] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topArtists = parseArtistsData(data);
        if (topArtists) {
          const topArtist = topArtists[0];

          // obtine date suplimentare din API si preaia imaginea din Spotify
          const enrichedArtist = await enrichArtistInfo(topArtist);
          setHighlightedArtist(enrichedArtist);
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
        console.error("Eroare in cautarea datelor:", error);
      }
    };

    fetchData();
  }, [data]);

  function handleHighlightedArtistOnClick() {
    if (highlightedArtist && highlightedArtist.artist) {
      const encodedName = encodeURIComponent(highlightedArtist.artist.name);
      navigate(`/top-artists/${encodedName}`, {
        state: {
          mbid: highlightedArtist.artist.mbid,
          artist: highlightedArtist.artist,
        },
      });
    }
  }

  return (
    <Layout>
      <Container className="mt-4">
        <Row className="mb-5">
          {/* Artist highlight */}
          <Col md={6}>
            <h2 className="text-center text-primary mb-3">
              Highlighted Artist
            </h2>
            {highlightedArtist ? (
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-center">
                    <strong>{highlightedArtist.artist.name}</strong>
                  </Card.Title>
                  <img
                    src={highlightedArtist.artist.spotifyPicture}
                    alt={highlightedArtist.artist.name}
                    className="img-fluid mb-3"
                    style={{ cursor: "pointer" }}
                    onClick={handleHighlightedArtistOnClick}
                  />
                  <Card.Text>
                    <strong>Last Week Plays: </strong>
                    {highlightedArtist.artist.stats.playcount}
                  </Card.Text>
                  <Card.Text>
                    <strong>About: </strong>
                    {highlightedArtist.artist.bio.summary}
                  </Card.Text>
                  <Card.Subtitle className="mb-2 text-muted">
                    <strong>Main Genres</strong>
                  </Card.Subtitle>
                  <ListGroup variant="flush">
                    {highlightedArtist.artist.tags.tag.map((tag, i) => (
                      <ListGroup.Item key={i}>{tag.name}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            ) : (
              <p className="text-center">Loading artist data...</p>
            )}
          </Col>

          {/* Album highlight */}
          <Col md={6}>
            <h2 className="text-center text-primary mb-3">Highlighted Album</h2>
            {highlightedAlbum ? (
              <Card className="mb-4 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-center">
                    <strong>{highlightedAlbum.album.name}</strong>
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
                    <strong>Release Year: </strong>
                    {highlightedAlbum.album.wiki &&
                    highlightedAlbum.album.wiki.published
                      ? new Date(
                          highlightedAlbum.album.wiki.published
                        ).getFullYear()
                      : "Unknown"}
                  </Card.Text>
                  <Card.Text>
                    <strong>About: </strong>
                    {highlightedAlbum.album.wiki &&
                    highlightedAlbum.album.wiki.summary
                      ? highlightedAlbum.album.wiki.summary
                      : "No description available."}
                  </Card.Text>
                  <Card.Subtitle className="mb-2 text-muted">
                    <strong>Track List</strong>
                  </Card.Subtitle>
                  <ListGroup variant="flush">
                    {highlightedAlbum.album.tracks.track.map((track, i) => (
                      <ListGroup.Item key={i}>{track.name}</ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            ) : (
              <p className="text-center">Loading album data...</p>
            )}
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
