
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { useReducer } from "react";
import { ArtistsContext } from "./store/Artists/context.js";
import { initialState, artistsReducer } from "./store/Artists/reducer.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <></>,
  },
  {
    path: "/favorites",
    element: <></>,
  },
  {
    path: "/top-artists",
    element: <></>,
  },
  {
    path: "/top-artists/:album",
    element: <></>,
  },
  {
    path: "/top-genres",
    element: <></>,
  },
]);

function App() {
  const [artistsState, artistsDispatch] = useReducer(
    artistsReducer,
    initialState
  );


  const artistsContextValue = { artistsState, artistsDispatch };

  return (
    <div className="App">
      <ArtistsContext.Provider value={artistsContextValue}>
        <RouterProvider router={router} />
      </ArtistsContext.Provider>
    </div>
  );
}

export default App;
