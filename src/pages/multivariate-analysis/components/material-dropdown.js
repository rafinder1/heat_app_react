import React from 'react';
import { Row, Dropdown } from 'react-bootstrap';

function MaterialsDropdown({ selectMaterial, materials, uniqueMaterials, onSelectMaterial, handleMaterials }) {
    return (
        <Row>
            <Dropdown onClick={handleMaterials} onSelect={onSelectMaterial} style={{ width: '100%' }}>
                <Dropdown.Toggle variant="light" style={{ width: '100%', margin: '2.5px' }}>
                    {selectMaterial !== null ? `Selected: ${selectMaterial} ` : 'Select MATERIAL'}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ width: '96.5%' }}>
                    {materials !== undefined && materials.material.length > 0 ? (
                        uniqueMaterials.map((item) => (
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
                        ))
                    ) : (
                        <Dropdown.Item disabled
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>No options available. Please select a material type first.</Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </Row>
    );
}

export default MaterialsDropdown;
