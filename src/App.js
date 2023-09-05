import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Use BrowserRouter instead of HashRouter
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CalculateTemperature from './screens/CalculateTemperature';
import Home from './screens/Home';
import MultivariateAnalysis from './screens/MultivariateAnalysis';
import Login from './screens/Login';

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/calc_temp" element={<CalculateTemperature />} />
            <Route path="/multi_analysis" element={<MultivariateAnalysis />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
