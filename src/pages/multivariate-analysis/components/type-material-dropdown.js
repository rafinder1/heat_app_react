import React from 'react';
import { Row, Dropdown } from 'react-bootstrap';

function TypeMaterialDropdown({ selectedOption, typeMaterial, onSelect }) {
    return (
        <Row>
            <p>Choose Type Material</p>
            <Dropdown onSelect={onSelect} >
                <Dropdown.Toggle variant="light" style={{ width: '100%', margin: '2.5px' }}>
                    {selectedOption !== null ? `Selected: ${selectedOption} ` : 'Select Layer Type'}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ width: '96.5%' }}>
                    {typeMaterial.map((item) => (
                        < Dropdown.Item
                            key={item.pk}
                            eventKey={item.type_layer}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {item.type_layer}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </Row >
    );
}

export default TypeMaterialDropdown;
