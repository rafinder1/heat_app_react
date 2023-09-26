import React from 'react';
import { Row, Dropdown } from 'react-bootstrap';

function ThicknessDropdown({ selectThickness, thickness, onSelectThickness, handleThickness }) {
    return (
        <Row>
            <Dropdown onClick={handleThickness} onSelect={onSelectThickness}>
                <Dropdown.Toggle variant="secondary" style={{ width: '100%', margin: '2.5px' }}>
                    {selectThickness !== null ? `Selected: ${selectThickness} ` : 'Select THICKNESS'}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ width: '96.5%', maxHeight: '200px', overflowY: 'auto' }}>
                    {thickness !== undefined && thickness.length > 0 ? (
                        thickness.map((item) => (
                            <Dropdown.Item
                                key={item}
                                eventKey={item}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {item}
                            </Dropdown.Item>
                        )
                        )) : (
                        <Dropdown.Item disabled
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>No options available. Please select a material first.</Dropdown.Item>
                    )

                    }
                </Dropdown.Menu>
            </Dropdown>
        </Row>
    );
}

export default ThicknessDropdown;