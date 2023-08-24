import { Container } from 'react-bootstrap'

import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CalculateTemperature from './screens/CalculateTemperature';

function App() {
  return (
    <div>
      <Header />
      <main className='py-3'>
        <Container>
          <CalculateTemperature />
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default App;
