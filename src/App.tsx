import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AlbumViewPage from './pages/AlbumViewPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/album/:albumId" element={<AlbumViewPage />} />
      </Routes>
    </Router>
  );
}

export default App;