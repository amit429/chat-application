import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Switch } from 'react-router-dom';

import Home from './Pages/Home';
import Chatpage from './Pages/Chatpage';

function App() {
  return (
    <div className='App'>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/chats" element={<Chatpage/>} />

        </Routes>
    </div>
  );
}

export default App;
