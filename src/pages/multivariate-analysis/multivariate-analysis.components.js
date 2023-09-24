import { useState, useEffect } from 'react';
import { Card, Col, Row, Dropdown, Table, Button } from 'react-bootstrap';

import CardHeader from '../../components/card-header';
import ClimateZoneDropdown from '../../components/climate-zone-dropdown';
import InputField from '../../components/input-field';

import { options } from '../../constans/constans';

function MultiAnalysis() {
    const [selectedTemp, setSelectedZone] = useState(null);
    const [inputTemp, setInputTemp] = useState(null);
    const [inputPower, setInputPower] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [materials, setMaterials] = useState();
    const [uniqueMaterials, setUniqueMaterials] = useState();
    const [selectMaterial, setSetelectMaterial] = useState(null);
    const [thickness, setThickness] = useState();
    const [selectThickness, setSelectThickness] = useState(null);
    const [rows, setRows] = useState([]);
    const [mvc, setMVC] = useState(null);


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
            response = await fetch('http://127.0.0.1:8000/api/thermal_isolation', {
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
            thickness.sort()
            setThickness(thickness);
        }


    }
    const onSelectThickness = (option) => {
        setSelectThickness(parseFloat(option));
    };

    const handleAddLayer = () => {
        if (selectedOption !== null && selectMaterial !== null && selectThickness !== null) {


            materials.material.forEach(element => {
                if (element.fields.name_layer === selectMaterial && element.fields.thickness === selectThickness) {
                    setRows([...rows, element.fields])
                }
            })
        }
    }

    const handleDelAllRows = () => {
        setRows([])
    }

    const handleCalculate = async () => {
        const requestData = {
            expected_temperature: inputTemp,
            data_building_partition: rows,
            heat_information: {
                inside_temperature: null,
                outside_temperature: selectedTemp, // Use the selected temperature
                inside_heater_power: inputPower,
                outside_heater_power: null,
            },
            method: 'finite_element_method',
        };
        const response = await fetch('http://127.0.0.1:8000/api/multi_variant_calc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        if (response.ok) {
            const polystyrene_information = await response.json();
            const rows = []
            for (let i = 0; i < polystyrene_information.name_layer.length; i++) {
                rows.push({
                    name_layer: polystyrene_information.name_layer[i],
                    thickness: polystyrene_information.thickness[i],
                    temperatures: polystyrene_information.temperatures[i],
                    thermal_conductivity: polystyrene_information.thermal_conductivity[i],
                    cost: polystyrene_information.cost[i]
                });
                setMVC(rows);
            }


        } else {
            // Handle error response
            const result = "Handle error response"
            setMVC(result)
        }

    }


    return (
        <>
            <Card>
                <CardHeader title="Multivariate Analysis" />
                <Card.Body>

                    <Row>
                        <Col>
                            <ClimateZoneDropdown
                                selectedTemp={selectedTemp}
                                options={options}
                                onSelect={handleDropdownSelect}
                            />
                        </Col>

                        <Col>
                            <InputField
                                value={inputTemp}
                                onChange={handleInputTemp}
                                placeholder={'Temperature'}
                                header={'Expected Temperature [°C]'}
                            />
                        </Col>

                        <Col>
                            <InputField
                                value={inputPower}
                                onChange={handleInputPower}
                                placeholder={'Power Heater'}
                                header={'Power Heater [W/m2]'}
                            />
                        </Col>
                    </Row>
                    <br></br>
                    <Row>
                        <Col>
                            <Row>
                                <p>Choose Type Material</p>
                                <Dropdown onSelect={onSelect} >
                                    <Dropdown.Toggle variant="light" style={{ width: '100%', margin: '2.5px' }}>
                                        {selectedOption !== null ? `Selected: ${selectedOption} ` : 'Select Layer Type'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={{ width: '96.5%' }}>
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
                            </Row>
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
                        </Col>
                        <Col className="d-flex align-items-center justify-content-center">

                            <Button variant="primary" onClick={handleAddLayer} style={{ width: '25%', margin: '10px' }}>Add Layer</Button >
                            <Button variant="danger" onClick={handleDelAllRows} style={{ width: '25%', margin: '10px' }}>Del All Layer</Button>
                            <Button variant="success" onClick={handleCalculate} style={{ width: '25%', margin: '10px' }}>Calculate</Button>

                        </Col>
                    </Row>
                    <br></br>
                    <Row>
                        <Col>
                            <h5>Table 1. Layers in the building envelope</h5>
                            <Table striped bordered hover variant="light">
                                <thead>
                                    <tr>
                                        <th>Type Layer</th>
                                        <th>Name Layer</th>
                                        <th>Thickness [m]</th>
                                        <th>λ [W/mK]</th>
                                        <th>Cost [PLN]</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={5}>Inner Wall</td>
                                    </tr>
                                    {rows.map((row, index) => (
                                        <tr key={index} >
                                            <td>{row.type_layer}</td>
                                            <td>{row.name_layer}</td>
                                            <td>{row.thickness}</td>
                                            <td>{row.thermal_conductivity}</td>
                                            <td>{row.cost}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan={5}>Outer Wall</td>
                                    </tr>
                                </tbody>
                            </Table>

                            <br></br>
                            <h5>Table 2. Optimized polystyrene layers</h5>

                            <Table striped bordered hover variant="light">
                                <thead>
                                    <tr>
                                        <th>Name Layer</th>
                                        <th>Thickness [m]</th>
                                        <th>λ [W/mK]</th>
                                        <th>Temperature [°C]</th>
                                        <th>Cost [PLN]</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mvc && mvc.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.name_layer}</td>
                                            <td>{row.thickness}</td>
                                            <td>{row.thermal_conductivity}</td>
                                            <td>{row.temperatures}</td>
                                            <td>{row.cost}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <br></br>
            <Card>
                <CardHeader title="Count Amount Polystyrene" >
                </CardHeader>
                <Card.Body>
                    <InputField
                        value={inputTemp}
                        onChange={handleInputTemp}
                        placeholder={'Wall Surface'}
                        header={'Wall Surface [m2]'}
                    />
                </Card.Body>
            </Card>
        </>

    )
}

export default MultiAnalysis