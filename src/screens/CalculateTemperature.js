import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Dropdown, ButtonGroup } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Plot from 'react-plotly.js';

const CustomTable = () => {
    const [data, setData] = useState([]);
    const [rows, setRows] = useState([]);
    const [result, setResult] = useState([]);
    const [selectedTemp, setSelectedZone] = useState(null);
    const [inputValue, setInputValue] = useState();
    const [selectedOption, setSelectedOption] = useState('heat');
    const [todoList, setTodoList] = useState([
        "Select a Climate Zone",
        "Select Heater or Temperature",
        "Add Layer"
    ]);

    const fetchData = async () => {

        const response = await fetch('http://127.0.0.1:8000/api/materials', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const jsonData = await response.json();
        setData(jsonData.materials);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleLayerChange = (index, selectedLayer) => {
        const newRows = [...rows];
        newRows[index].name_layer = selectedLayer;

        // Fetch corresponding data from JSON and update the row
        const matchingData = data.find(item => item.fields.name_layer === selectedLayer);

        if (matchingData) {
            console.log(matchingData)
            newRows[index].type_layer = matchingData.fields.type_layer;
            newRows[index].thickness = matchingData.fields.thickness;
            newRows[index].thermal_conductivity = matchingData.fields.thermal_conductivity;
            newRows[index].cost = matchingData.fields.cost;
        }

        setRows(newRows);
    };

    const addRowWithDropdown = (name_layer) => {
        setRows([...rows, { type_layer: '', name_layer: '', thickness: '', thermal_conductivity: '', cost: '' }]);

        const updatedList = todoList.filter(item => item !== "Add Layer");
        setTodoList(updatedList);
    };

    const handleCalculate = async () => {
        const requestData = {
            data_building_partition: rows,
            heat_information: {
                inside_temperature: selectedOption === 'heat' ? null : inputValue,
                outside_temperature: selectedTemp, // Use the selected temperature
                inside_heater_power: selectedOption === 'heat' ? inputValue : null,
                outside_heater_power: null,
            },
            method: 'finite_element_method',
        };


        const response = await fetch('http://127.0.0.1:8000/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        if (response.ok) {
            const temp = await response.json();
            // Handle the calculated result (update UI or show a message)

            setResult(temp);
        } else {
            // Handle error response
            const result = "Handle error response"
            setResult(result)
        }
    };
    const dropdownOptions = data.map(item => item.fields.name_layer);
    // const dropdownOptions = [];

    const options = [
        { label: 'Zone I - External Temperature θe = -16 °C', value: 'Temperature: -16°C' },
        { label: 'Zone II - External Temperature θe = -18 °C', value: 'Temperature: -18°C' },
        { label: 'Zone III - External Temperature θe = -20 °C', value: 'Temperature: -20°C' },
        { label: 'Zone IV - External Temperature θe = -22 °C', value: 'Temperature: -22°C' },
        { label: 'Zone V - External Temperature θe = -24 °C', value: 'Temperature: -24°C' },
    ];




    const handleDropdownSelect = (eventKey) => {

        const selectedTemperature = parseInt(eventKey.split(': ')[1]); // Extract temperature from "Temperature: -16°C"

        setSelectedZone(selectedTemperature);

        const updatedList = todoList.filter(item => item !== "Select a Climate Zone");
        setTodoList(updatedList);
    };




    const handleRadioChange = (value) => {
        setSelectedOption(value);
        setInputValue('');
    };

    const handleInputChange = (event) => {
        const inputValue = event.target.value;

        if (inputValue !== '') {
            const parsedValue = parseFloat(inputValue);

            if (!isNaN(parsedValue)) {
                setInputValue(parsedValue);

                // If inputValue is a valid number (not NaN), remove "Select Heater or Temperature" from the todo list
                const updatedList = todoList.filter(item => item !== "Select Heater or Temperature");
                setTodoList(updatedList);
            } else {
                // If inputValue cannot be parsed as a valid number, keep "Select Heater or Temperature" in the todo list
                setInputValue('');
                if (!todoList.includes("Select Heater or Temperature")) {
                    setTodoList([...todoList, "Select Heater or Temperature"]);
                }
            }
        } else {
            // If inputValue is empty, keep "Select Heater or Temperature" in the todo list
            setInputValue('');
            if (!todoList.includes("Select Heater or Temperature")) {
                setTodoList([...todoList, "Select Heater or Temperature"]);
            }
        }
    };

    const getPlaceholderText = () => {
        if (selectedOption === 'heat') {
            return 'Power Heater [W/m2]';
        } else if (selectedOption === 'temp') {
            return 'Temperature [°C]';
        }
        return 'Enter value';
    };

    const scatterData = [
        {
            x: result.thickness,
            y: result.temp,
            mode: 'markers+lines',
            type: 'scatter',
        },
    ];

    return (
        <div>
            <Card>
                <Card.Header style={{ textAlign: 'center' }}>
                    <h3>Basic Partition Data</h3>
                </Card.Header>
                <Card.Body>

                    <Row>
                        <Col>
                            <h5>Select a Climate Zone:</h5>
                            <Dropdown onSelect={handleDropdownSelect}>
                                <Dropdown.Toggle variant="light" style={{ width: '100%' }}>
                                    {selectedTemp !== null
                                        ? `external temperature: ${selectedTemp} °C`
                                        : 'Select Temperature'}
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
                            <br />

                            <h5>Select the Conditions in the Building Partition:</h5>


                            <ButtonGroup aria-label="Basic example" vertical className="d-flex align-items-center">
                                <Button onClick={() => handleRadioChange('heat')} variant="light" style={{ background: 'white' }}>
                                    <img src="/dirichlet-neumann.jpg" alt="Heat" width="400" height="242" />
                                </Button>
                                <Button onClick={() => handleRadioChange('temp')} variant="light" style={{ background: 'white' }}>
                                    <img src="/dirichlet-dirichlet.jpg" alt="Temp" width="400" height="242" />
                                </Button>
                            </ButtonGroup>
                        </Col>

                        <Col>
                            <h5>Heated Area (height 2.5 m)</h5>
                            <Table striped bordered hover variant="light">
                                <thead>
                                    <tr>
                                        <th>Radiator power</th>
                                        <th>* 80 W/m<sup>2</sup></th>
                                        <th>** 120 W/m<sup>2</sup></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>250 W</td>
                                        <td>3 m<sup>2</sup></td>
                                        <td>2 m<sup>2</sup></td>
                                    </tr>
                                    <tr>
                                        <td>500 W</td>
                                        <td>4-6 m<sup>2</sup></td>
                                        <td>4 m<sup>2</sup></td>
                                    </tr>
                                    <tr>
                                        <td>750 W</td>
                                        <td>7-9 m<sup>2</sup></td>
                                        <td>5-6 m<sup>2</sup></td>
                                    </tr>
                                    <tr>
                                        <td>1000 W</td>
                                        <td>10-12 m<sup>2</sup></td>
                                        <td>7-8 m<sup>2</sup></td>
                                    </tr>
                                    <tr>
                                        <td>1300 W</td>
                                        <td>13-16 m<sup>2</sup></td>
                                        <td>9-11 m<sup>2</sup></td>
                                    </tr>
                                    <tr>
                                        <td>1500 W</td>
                                        <td>17-18 m<sup>2</sup></td>
                                        <td>12-13 m<sup>2</sup></td>
                                    </tr>
                                    <tr>
                                        <td>2000 W</td>
                                        <td>19-25 m<sup>2</sup></td>
                                        <td>14-17 m<sup>2</sup></td>
                                    </tr>
                                </tbody>
                            </Table>
                            <p>* new buildings, rooms with good thermal insulation (80 W/m<sup>2</sup>)</p>
                            <p>** old buildings, rooms with poorer thermal insulation (120 W/m<sup>2</sup>)</p>
                            <br />
                            <h5>Enter Value: </h5>
                            <Form.Group controlId="inputField">
                                {/* <Form.Label>Input Field</Form.Label> */}
                                <Form.Control
                                    type="number"
                                    placeholder={getPlaceholderText()}
                                    value={inputValue}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <br />
            <Card>
                <Card.Header style={{ textAlign: 'center' }}>
                    <h3>Layers of Building Partition</h3>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <div>
                            <h4>Things ToDo to Calculate the Temperature:</h4>
                            <ul>
                                {todoList.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                            {todoList.length === 0 && <p>You can calculate</p>}
                        </div>
                    </Row>
                    <br />
                    <Row>
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
                                    <tr key={index}>
                                        <td>{row.type_layer}</td>
                                        <td>
                                            <Form.Control
                                                as="select"
                                                value={row.selectedLayer}
                                                onChange={e => handleLayerChange(index, e.target.value)}
                                            >
                                                <option value="">Select Layer</option>
                                                {dropdownOptions.map(option => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </td>
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
                    </Row>

                    <br />

                    <Row className="d-flex justify-content-center mb-3">
                        <Button onClick={() => addRowWithDropdown()} style={{ width: '25%', margin: '10px' }}>Add Layer</Button>
                        <Button onClick={handleCalculate} style={{ width: '25%', margin: '10px' }} variant="success">Calculate</Button>
                    </Row>

                    <br />

                    <Row>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Plot
                                data={scatterData}
                                layout={{
                                    title: 'Temperature Distribution',
                                    xaxis: { title: 'Thickness [m]' },
                                    yaxis: { title: 'Temperature [°C]' },
                                }}
                            />
                        </div>
                    </Row>
                </Card.Body>
            </Card>
        </div >
    );
};

export default CustomTable;
