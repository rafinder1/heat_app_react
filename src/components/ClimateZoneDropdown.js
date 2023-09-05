import React from 'react';
import { Dropdown } from 'react-bootstrap';

const ClimateZoneDropdown = ({ selectedTemp, options, onSelect }) => (
    <>
        <h5>Select a Climate Zone:</h5>
        <Dropdown onSelect={onSelect}>
            <Dropdown.Toggle variant="light" style={{ width: '100%' }}>
                {selectedTemp !== null ? `external temperature: ${selectedTemp} °C` : 'Select Temperature'}
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: '100%' }}>
                {options.map(option => (
                    <Dropdown.Item
                        key={option.value}
                        eventKey={option.value}
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {option.label}
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    </>
);

export default ClimateZoneDropdown;