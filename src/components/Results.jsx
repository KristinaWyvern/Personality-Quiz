import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function Results({ element, artwork: initialArtwork, resetQuiz }) {
  const { name } = useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!initialArtwork);
  const [artwork, setArtwork] = useState(initialArtwork);
  const [error, setError] = useState(false);

  async function fetchArtworkAgain() {
    setLoading(true);
    setError(false);
    try {
      const keyword = element && element.toLowerCase();
      const res = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${keyword}`
      );
      const data = await res.json();
      if (data.objectIDs && data.objectIDs.length > 0) {
        const objectID = data.objectIDs[Math.floor(Math.random() * data.objectIDs.length)];
        const artRes = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`
        );
        const artData = await artRes.json();
        setArtwork(artData);
        
      } else {
        setArtwork(null);
      }
    } catch (e) {
      setError(true);
      setArtwork(null);
    }
    setLoading(false);
  }

  React.useEffect(() => {
    if (!artwork && element) {
      fetchArtworkAgain();
    }
  }, [element]);

  function handleGoBack() {
    resetQuiz();
    navigate("/");
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
      <div style={{ background: '#00000030', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 20, minWidth: 300, maxWidth: 400, textAlign: 'center' }}>
        <p style={{ fontSize: 20, marginBottom: 24 }}>
          <strong>{name}</strong>, your element is: <span style={{ color: 'black' }}>{element}</span>
        </p>
        {loading  ? <LoadingSpinner /> : error ? (
          <> 
            <img src={`https://raw.githubusercontent.com/KristinaWyvern/Personality-Quiz/main/public/${element}.jpg`} alt={element}   style={{ maxWidth: '80%', borderRadius: 10, margin: '10px 0' }}/>           
            <p style={{ color: 'red', marginBottom: 24 }}>Failed to load artwork. Please try again.</p>
            <button onClick={fetchArtworkAgain} style={{ background: '#0074D9', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontSize: 16, cursor: 'pointer', marginTop: 2, marginRight:15 }}>Refresh</button>
            <button onClick={handleGoBack} style={{ background: '#0074D9', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontSize: 16, cursor: 'pointer', marginTop: 2, marginRight:15 }}> Go Back</button>
          </>
        ) : artwork ? (
          <div className="artwork" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 22, margin: '10px 0' }}>{artwork.title}</h2>
            <img src={artwork.primaryImage||`https://raw.githubusercontent.com/KristinaWyvern/Personality-Quiz/main/public/${element}.jpg`} alt={artwork.title} style={{ maxWidth: '80%', borderRadius: 10, margin: '10px 0' }} />
            <p style={{ fontStyle: 'italic', color: 'black' }}>{artwork.artistDisplayName}</p>
            <p style={{ color: '#444444' }}>{artwork.objectDate}</p>
            <button onClick={fetchArtworkAgain} style={{ background: '#0074D9', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontSize: 16, cursor: 'pointer', marginTop: 2, marginRight:15 }}>Refresh</button>
            <button onClick={handleGoBack} style={{ background: '#0074D9', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontSize: 16, cursor: 'pointer', marginTop: 2, marginRight:15 }}> Go Back</button>
          </div>
        ) : (
          <>
            <img src={`https://raw.githubusercontent.com/KristinaWyvern/Personality-Quiz/main/public/${element}.jpg`} alt={element}   style={{ maxWidth: '80%', borderRadius: 10, margin: '10px 0' }}/>
            <p style={{ color: '#444444', marginBottom: 24 }}>No artwork found.</p>            
            <button onClick={fetchArtworkAgain} style={{ background: '#0074D9', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontSize: 16, cursor: 'pointer', marginTop: 2, marginRight:15 }}>Refresh</button>            
            <button onClick={handleGoBack} style={{ background: '#0074D9', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 6, fontSize: 16, cursor: 'pointer', marginTop: 2, marginRight:15 }}> Go Back</button>
          
          </>
        )} 
      </div>
    </div>
  );
}