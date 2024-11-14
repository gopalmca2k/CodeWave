import { useState } from 'react';
import Form from './components/form/Form'; // Ensure this path is correct
import Searchbox from './components/searchbox/Searchbox'; // Ensure this path is correct and use uppercase
import Usertable from './components/user_details/user_details.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  

  return (
    <Router>
    <Routes>
      <Route path="/" element={<Form />} />
      <Route path="/Search" element={<Searchbox />} />
      <Route path="/Usertable" element={<Usertable />} />
    </Routes>
  </Router>
  );
}

export default App;

