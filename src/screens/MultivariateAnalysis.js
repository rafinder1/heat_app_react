import { useState, useEffect } from 'react';
import { Card, Col, Row, Dropdown } from 'react-bootstrap';

import CardHeader from '../components/CardHeader';
import ClimateZoneDropdown from '../components/ClimateZoneDropdown';
import InputField from '../components/InputField';

import { options } from '../CalculateTemperature/constans/Constans';

function MultiAnalysis() {
    const [selectedTemp, setSelectedZone] = useState(null);
    const [inputTemp, setInputTemp] = useState();
    const [inputPower, setInputPower] = useState();
    const [selectedOption, setSelectedOption] = useState(null);
    const [materials, setMaterials] = useState();
    const [uniqueMaterials, setUniqueMaterials] = useState();
    const [selectMaterial, setSetelectMaterial] = useState(null);
    const [thickness, setThickness] = useState();
    const [selectThickness, setSelectThickness] = useState(null);


    const handleDropdownSelect = (eventKey) => {

        const selectedTemperature = parseInt(eventKey.split(': ')[1]);

        setSelectedZone(selectedTemperature);
    };

    const handleInputTemp = (event) => {
        const inputValue = event.target.value;

        if (inputValue !== '') {
            const parsedValue = parseFloat(inputValue);

            if (!isNaN(parsedValue)) {
                setInputTemp(parsedValue)
            }
        }
    }

    const handleInputPower = (event) => {
        const inputValue = event.target.value;

        if (inputValue !== '') {
            const parsedValue = parseFloat(inputValue);

            if (!isNaN(parsedValue)) {
                setInputPower(parsedValue)
            }
        }
    }


    const useDataFetching = () => {
        const [typeMaterial, setTypeMaterial] = useState([]);
        const fetchData = async () => {

            const response = await fetch('http://127.0.0.1:8000/api/type_layers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const jsonData = await response.json();
            setTypeMaterial(jsonData.type_layers);
        }
        useEffect(() => {
            fetchData();
        }, []);

        return typeMaterial;
    };

    const typeMaterial = useDataFetching();

    const onSelect = (option) => {
        setSelectedOption(option);
        setSetelectMaterial(null);
        setSelectThickness(null);
    };



    const handleMaterials = async () => {

        let response

        if (selectedOption === 'ocieplenie') {
            response = await fetch('http://127.0.0.1:8000/api/polystyrene', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        } else {
            response = await fetch(`http://127.0.0.1:8000/api/materials/filter?selected_type=${selectedOption}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }

        if (response.ok) {
            const materials = await response.json();
            setMaterials(materials);

            const uniqueMaterials = Array.from(new Set(materials.material.map(item => item.fields.name_layer)));

            setUniqueMaterials(uniqueMaterials)
        }


    }

    const onSelectMaterial = (option) => {
        setSetelectMaterial(option);
        setSelectThickness(null);
    };



    const handleThickness = () => {
        if (materials !== undefined) {

            let thickness = [];

            if (selectMaterial !== null) {
                materials.material.forEach(element => {
                    if (element.fields.name_layer === selectMaterial) {
                        thickness.push(element.fields.thickness)
                    }
                })

            }
            setThickness(thickness);
        }


    }
    const onSelectThickness = (option) => {
        setSelectThickness(option);
    };






    return (
        <Card>
            <CardHeader title="Basic Partition Data" />
            <Card.Body>
                <Row>
                    <Col>
                        <ClimateZoneDropdown
                            selectedTemp={selectedTemp}
                            options={options}
                            onSelect={handleDropdownSelect}
                        />
                        <InputField
                            value={inputTemp}
                            onChange={handleInputTemp}
                            placeholder={'Temperature [°C]'}
                        />
                        <InputField
                            value={inputPower}
                            onChange={handleInputPower}
                            placeholder={'Power Heater [W/m2]'}
                        />
                        <p>Choose Type Material</p>
                        <Dropdown onSelect={onSelect}>
                            <Dropdown.Toggle variant="light" style={{ width: '100%' }}>
                                {selectedOption !== null ? `Selected: ${selectedOption} ` : 'Select Layer Type'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ width: '100%' }}>
                                {typeMaterial.map((item) => (
                                    <Dropdown.Item
                                        key={item.pk}
                                        eventKey={item.fields.type_layer}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        {item.fields.type_layer}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown onClick={handleMaterials} onSelect={onSelectMaterial}>
                            <Dropdown.Toggle variant="light" style={{ width: '100%' }}>
                                {selectMaterial !== null ? `Selected: ${selectMaterial} ` : 'Select MATERIAL'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {materials !== undefined && materials.material.length > 0 ? (
                                    uniqueMaterials.map((item) => (
                                        <Dropdown.Item
                                            key={item}
                                            eventKey={item}
                                        >
                                            {item}
                                        </Dropdown.Item>
                                    ))
                                ) : (
                                    <Dropdown.Item disabled>No options available. Please select a material type first.</Dropdown.Item>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Dropdown onClick={handleThickness} onSelect={onSelectThickness}>
                            <Dropdown.Toggle variant="light" style={{ width: '100%' }}>
                                {selectThickness !== null ? `Selected: ${selectThickness} ` : 'Select THICKNESS'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {thickness !== undefined && thickness.length > 0 ? (
                                    thickness.map((item) => (
                                        <Dropdown.Item
                                            key={item}
                                            eventKey={item}
                                        >
                                            {item}
                                        </Dropdown.Item>
                                    )
                                    )) : (
                                    <Dropdown.Item disabled>No options available. Please select a material first.</Dropdown.Item>
                                )

                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </Card.Body>
        </Card>

    )
}

export default MultiAnalysis