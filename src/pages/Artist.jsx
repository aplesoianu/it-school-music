import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import { TopArtistsContext } from "../store/TopArtists/context";
import Layout from "../components/Layout";

export default function Artist() {
  // The route param "artist" will contain the encoded name.
  const { artist: encodedArtistName } = useParams();
  const { artists } = useContext(TopArtistsContext);

  console.log({ artists });
  console.log(encodedArtistName);
  // Find the matching artist in the stored top artists by comparing encodedName.
  const artistDetails = artists.find(
    (item) => item.artist.name === encodedArtistName
  );

  if (!artistDetails) {
    return (
      <Container className="my-5">
        <p>Artist not found.</p>
      </Container>
    );
  }

  const artist = artistDetails.artist;
  const imageUrl =
    artist.spotifyPicture ||
    (artist.image &&
      artist.image.find((img) => img.size === "extralarge")?.["#text"]) ||
    "";
  const bioSnippet =
    artist.bio && artist.bio.summary
      ? artist.bio.summary.split("<a")[0]
      : "No bio available.";
  const albums = artistDetails.albums?.topalbums?.album || [];

  return (
    <Layout>
      <Container className="my-5">
        <h1 className="text-center mb-4">{artist.name}</h1>
        {imageUrl && (
          <div className="text-center mb-4">
            <img
              src={imageUrl}
              alt={artist.name}
              style={{ maxWidth: "300px", borderRadius: "8px" }}
            />
          </div>
        )}
        <Row className="mb-5">
          <Col>
            <h3>Bio</h3>
            <p>{bioSnippet}</p>
          </Col>
        </Row>
        <Row>
          <h3 className="mb-3">Top Albums</h3>
          {albums.length > 0 ? (
            albums.map((album, idx) => {
              const albumImage =
                album.image &&
                album.image.find((img) => img.size === "extralarge")?.["#text"];
              return (
                <Col md={3} sm={6} xs={12} key={idx} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    {albumImage && (
                      <Card.Img
                        variant="top"
                        src={albumImage}
                        alt={album.name}
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{album.name}</Card.Title>
                    </Card.Body>
                    <Card.Footer>
                      <a
                        href={album.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Last.fm
                      </a>
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })
          ) : (
            <p>No albums available.</p>
          )}
        </Row>
      </Container>
    </Layout>
  );
}
