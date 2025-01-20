import { useState } from 'react';
import './App.css';

function App() {
  const [videoId, setVideoId] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [error, setError] = useState('');

  const API_KEY = 'AIzaSyDhf73DqXLCkONOUhWB94xF-JMNHUZcgyI';

  const fetchVideoInfo = async () => {
    if (!videoId) {
      setError('Please enter a video ID.');
      return;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.items.length > 0) {
        setVideoInfo(data.items[0]);
        setError('');
      } else {
        setError('Video not found or unavailable.');
        setVideoInfo(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch video information.');
      setVideoInfo(null);
    }
  };

  return (
    <div className="app-container" style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>YouTube Video Information</h1>

      {/* Input and Fetch Button */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter YouTube Video ID"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          style={{
            padding: '10px',
            width: '300px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          onClick={fetchVideoInfo}
          style={{
            padding: '10px 20px',
            marginLeft: '10px',
            backgroundColor: '#FF0000',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Fetch Info
        </button>
      </div>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Video Information */}
      {videoInfo && (
  <div
    style={{
      marginTop: '20px',
      border: '1px solid #ccc',
      padding: '20px',
      borderRadius: '8px',
    }}
  >
    <h2 style={{ marginBottom: '20px' }}>{videoInfo.snippet.title}</h2>
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>Description</td>
          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{videoInfo.snippet.description}</td>
        </tr>
        <tr>
          <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>Views</td>
          <td style={{ padding: '10px', border: '1px solid #ddd' }}>{videoInfo.statistics.viewCount}</td>
        </tr>
        <tr>
          <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>Likes</td>
          <td style={{ padding: '10px', border: '1px solid #ddd' }}>
            {videoInfo.statistics.likeCount || 'Unavailable'}
          </td>
        </tr>
        <tr>
          <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>Comments</td>
          <td style={{ padding: '10px', border: '1px solid #ddd' }}>
            {videoInfo.statistics.commentCount || 'Unavailable'}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)}

    </div>
  );
}

export default App;
