import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Button, ButtonGroup } from '@chakra-ui/react';
import Homepage from './pages/Homepage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div className="App">
      {/* <Router> */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/chats" element={<ChatPage />} />
        </Routes>
      {/* </Router> */}
    </div>
  );
}

export default App;
