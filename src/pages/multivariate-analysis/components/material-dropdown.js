import React from 'react';
import { Row, Dropdown } from 'react-bootstrap';

function MaterialsDropdown({ selectMaterial, materials, onSelectMaterial, handleMaterials }) {
    return (
        <Row>
            <Dropdown onClick={handleMaterials} onSelect={onSelectMaterial} style={{ width: '100%' }}>
                <Dropdown.Toggle variant="light" style={{ width: '100%', margin: '2.5px' }}>
                    {selectMaterial !== null ? `Selected: ${selectMaterial} ` : 'Select MATERIAL'}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ width: '96.5%' }}>
                    {materials !== undefined && materials.length > 0 ? (
                        materials.map((item) => (
                            <Dropdown.Item
                                key={item.id}
                                eventKey={item.name_layer}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {item.name_layer}
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
