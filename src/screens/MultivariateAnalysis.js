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
    };

    console.log(typeMaterial)
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
                                {selectedOption !== null
                                    ? `Selected: ${selectedOption.fields.type_layer}`
                                    : 'Select Layer Type'}
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
                    </Col>
                </Row>
            </Card.Body>
        </Card>

    )
}

export default MultiAnalysis