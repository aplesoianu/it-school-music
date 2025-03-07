import "./Header.css";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="Header">
      <nav className="nav bg-primary w-100">
        <Container className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center">
            <Link to="/">
              <img src="/img/vinyl_logo.png" alt="Vinyl black white" />
            </Link>
            <h1 className="app-title text-light">React Music Explorer</h1>
          </div>
          <ul className="custom-dropdown-menu d-flex">
            <li>
              <Link className="p-3 text-uppercase text-light" to="/top-artists">
                Top Artists
              </Link>
            </li>
            <li>
              <Link className="p-3 text-uppercase text-light" to="/top-genres">
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
