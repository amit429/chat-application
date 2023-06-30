import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Switch } from 'react-router-dom';
import { ChakraBaseProvider } from '@chakra-ui/react';
import Login from './Pages/Login';

function App() {
  return (
    <ChakraBaseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
        </Routes>
      </BrowserRouter>
    </ChakraBaseProvider>
  );
}

export default App;
