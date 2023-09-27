import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import CalculateTemperature from './calculate-temperature/calculate-temperature.components';
import Home from './home/home';
import MultivariateAnalysis from './multivariate-analysis/multivariate-analysis.components';
import CountAmountPolystyrene from './count-amount-polystyrene/count-amount-polystyrene.components';
import Login from './login/login';

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
            <Route path="/count_amount_polystyrene" element={<CountAmountPolystyrene />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
