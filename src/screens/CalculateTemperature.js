import React, { useState } from 'react';
import { Table, Button, Form, Dropdown, ButtonGroup } from 'react-bootstrap';
import Plot from 'react-plotly.js';
import data from './data.json'; // Replace with your JSON data

const CustomTable = () => {
    const [rows, setRows] = useState([]);
    const [result, setResult] = useState([]);
    const [selectedZone, setSelectedZone] = useState(null);
    const [inputValue, setInputValue] = useState();
    const [selectedOption, setSelectedOption] = useState('heat');

    const handleLayerChange = (index, selectedLayer) => {
        const newRows = [...rows];
        newRows[index].name_layer = selectedLayer;

        // Fetch corresponding data from JSON and update the row
        const matchingData = data.find(item => item.name_layer === selectedLayer);
        if (matchingData) {
            newRows[index].type_layer = matchingData.type_layer;
            newRows[index].thickness = parseFloat(matchingData.thickness);
            newRows[index].thermal_conductivity = parseFloat(matchingData.thermal_conductivity);
            newRows[index].cost = parseFloat(matchingData.cost);
        }

        setRows(newRows);
    };

    const addRowWithDropdown = (name_layer) => {
        setRows([...rows, { type_layer: '', name_layer: '', thickness: '', thermal_conductivity: '', cost: '' }]);
    };

    const handleCalculate = async () => {
        const requestData = {
            data_building_partition: rows,
            heat_information: {
                inside_temperature: selectedOption === 'heat' ? '' : inputValue,
                outside_temperature: selectedZone, // Use the selected temperature
                inside_heater_power: selectedOption === 'heat' ? inputValue : '',
                outside_heater_power: '',
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
        console.log(requestData)
        if (response.ok) {
            const temp = await response.json();
            // Handle the calculated result (update UI or show a message)

            setResult(JSON.stringify(temp, null, 2))
        } else {
            // Handle error response
            const result = "Handle error response"
            setResult(result)
        }
    };

    const dropdownOptions = data.map(item => item.name_layer); // Extract layer names from data

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
    };




    const handleRadioChange = (value) => {
        setSelectedOption(value);
        setInputValue('');
    };

    const handleInputChange = (event) => {
        setInputValue(parseFloat(event.target.value));
    };

    const getPlaceholderText = () => {
        if (selectedOption === 'heat') {
            return 'Power Heater';
        } else if (selectedOption === 'temp') {
            return 'Temperature';
        }
        return 'Enter value';
    };

    const scatterData = [
        {
            x: [1, 2, 3, 4],
            y: [10, 11, 9, 12],
            mode: 'markers',
            type: 'scatter',
        },
    ];


    return (
        <div>
            <Dropdown onSelect={handleDropdownSelect}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {/* {-16 ? (-16, console.log(123)) : 'Select Zone'} */}
                    {'Select Zone'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {options.map(option => (
                        <Dropdown.Item key={option.value} eventKey={option.value}>
                            {option.label}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            <div>
                {selectedZone && <p>You selected: {selectedZone}</p>}
            </div>

            <ButtonGroup aria-label="Basic example">
                <Button onClick={() => handleRadioChange('heat')}>Heat</Button>
                <Button onClick={() => handleRadioChange('temp')}>Temp</Button>
            </ButtonGroup>

            <Form.Group controlId="inputField">
                {/* <Form.Label>Input Field</Form.Label> */}
                <Form.Control
                    type="number"
                    placeholder={getPlaceholderText()}
                    value={inputValue}
                    onChange={handleInputChange}
                />
            </Form.Group>
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
            <Button onClick={() => addRowWithDropdown()}>Add Layer</Button>
            <Button onClick={handleCalculate}>Calculate</Button>
            <div>{result}</div>

            <Plot
                data={scatterData}
                layout={{ title: 'Scatter Plot' }}
            />
        </div>
    );
};

export default CustomTable;
