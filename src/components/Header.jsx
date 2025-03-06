import "./Header.css";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="Header">
      <nav className="nav bg-primary w-100">
        <Container className="d-flex justify-content-between align-items-center w-100">
          <img src="/img/vinyl_logo.png" alt="Vinyl black white" />
          <ul className="custom-dropdown-menu d-flex">
            <li>
              <Link className="p-3 text-uppercase text-light" to="/topArtists">
                Top Artists
              </Link>
            </li>
            <li>
              <Link className="p-3 text-uppercase text-light" to="/topGenres">
                Top Genres
              </Link>
            </li>
            <li>
              <Link className="p-3 text-uppercase text-light" to="/favorites">
                Favorite Artists
              </Link>
            </li>
          </ul>
        </Container>
      </nav>
    </header>
  );
}
