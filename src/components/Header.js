import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
function Header() {
    return (
        <header>
            <Navbar expand="lg" bg='dark' variant='dark' collapseOnSelect>
                <Container>
                    <Navbar.Brand href="/"><i className='fas fa-home'></i>  HEATER</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/calc_temp"><i className='fas fa-thermometer-half'></i>  Calculate Temperature</Nav.Link>
                            <Nav.Link href="/multi_analysis">Multivariate Analysis</Nav.Link>
                            <Nav.Link href="/count_amount_polystyrene">Count Amount Polystyrene</Nav.Link>
                            <Nav.Link href="/login"><i className='fas fa-user'></i>  Login</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header