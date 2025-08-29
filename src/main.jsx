import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/sos" element={<SosPage />} /> */}
        {/* <Route path="/schedule" element={<SchedulePage />} /> */}
        {/* <Route path="/nearby" element={<NearbyPage />} /> */}
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

