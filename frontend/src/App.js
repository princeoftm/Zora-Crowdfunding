import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import Mint from './Pages/mint';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="Mint" element={<Mint />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
