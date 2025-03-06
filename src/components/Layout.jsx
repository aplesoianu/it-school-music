import Footer from "./Footer";
import Header from "./Header";
import "./Layout.css";

export default function Layout(props) {
  return (
    <div className="Layout bg-secondary">
      <Header />
      <main className="bg-secondary">{props.children}</main>
      <Footer />
    </div>
  );
}
