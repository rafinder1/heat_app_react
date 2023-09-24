import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

const BuildingConditionsSection = ({ handleRadioChange }) => {
    return (
        <>
            <h5>Select the Conditions in the Building Partition:</h5>
            <ButtonGroup aria-label="Basic example" vertical className="d-flex align-items-center">
                <Button onClick={() => handleRadioChange('heat')} variant="light" style={{ background: 'white' }}>
                    <img src="/dirichlet-neumann.jpg" alt="Heat" width="400" height="242" />
                </Button>
                <Button onClick={() => handleRadioChange('temp')} variant="light" style={{ background: 'white' }}>
                    <img src="/dirichlet-dirichlet.jpg" alt="Temp" width="400" height="242" />
                </Button>
            </ButtonGroup>
        </>
    );
};

export default BuildingConditionsSection;