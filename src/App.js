import { useEffect } from "react";
import { getSpotifyToken } from "./api/endpoints";

function App() {

  useEffect(()=>{

    const fetchToken = async ()=>{
      try {
        const token = await getSpotifyToken();
        console.log('Spotify Token:', token);
      } catch (error) {
        console.error('Error fetching Spotify token:', error);
      }

    }

    fetchToken()
  }, [])

  return (
    <div>Test</div>
  );
}

export default App;
