import React, { useState } from 'react';
import { Table, Button, Form, Dropdown, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import data from './data.json'; // Replace with your JSON data

const CustomTable = () => {
    const [rows, setRows] = useState([]);
    const [result, setResult] = useState([]);

    const handleLayerChange = (index, selectedLayer) => {
        const newRows = [...rows];
        newRows[index].selectedLayer = selectedLayer;

        // Fetch corresponding data from JSON and update the row
        const matchingData = data.find(item => item.layer === selectedLayer);
        if (matchingData) {
            newRows[index].thickness = matchingData.thickness;
            newRows[index].lambda = matchingData.lambda;
            newRows[index].cost = matchingData.cost;
        }

        setRows(newRows);
    };

    const addRowWithDropdown = (layer) => {
        setRows([...rows, { layer, selectedLayer: '', thickness: '', lambda: '', cost: '' }]);
    };

    const handleCalculate = async () => {
        const requestData = {
            data_building_partition: rows,
            heat_information: {
                inside_temperature: '',
                outside_temperature: -20,
                inside_heater_power: 80,
                outside_heater_power: '',
            },
            method: 'finite_element_method',
        };

        console.log(requestData)
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
            console.log()
            setResult(JSON.stringify(temp, null, 2))
        } else {
            // Handle error response
            const result = "Handle error response"
            setResult(result)
        }
    };

    const dropdownOptions = data.map(item => item.layer); // Extract layer names from data

    const options = [
        { label: 'Zone I - External Temperature θe = -16 °C', value: 'Temperature: -16°C' },
        { label: 'Zone II - External Temperature θe = -18 °C', value: 'Temperature: -18°C' },
        { label: 'Zone III - External Temperature θe = -20 °C', value: 'Temperature: -20°C' },
        { label: 'Zone IV - External Temperature θe = -22 °C', value: 'Temperature: -22°C' },
        { label: 'Zone V - External Temperature θe = -24 °C', value: 'Temperature: -24°C' },
    ];


    const [selectedZone, setSelectedZone] = useState(null);

    const handleDropdownSelect = (eventKey, event) => {
        setSelectedZone(options.find(option => option.value === eventKey));
    };


    const radioOptions = [
        { label: 'Heat', value: "Heat" },
        { label: 'Temp', value: 'Temp' },
    ];

    const [selectedOption, setSelectedOption] = useState(null);

    const handleRadioChange = (value) => {
        console.log(value);
        setSelectedOption(value);
    };

    return (
        <div>
            <Dropdown onSelect={handleDropdownSelect}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {selectedZone ? selectedZone.value : 'Select Zone'}
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
                {selectedZone && <p>You selected: {selectedZone.value}</p>}
            </div>

            <ToggleButtonGroup type="radio" name="options" value={selectedOption}>
                {radioOptions.map((option) => (
                    <ToggleButton
                        key={option.value}
                        value={option.value}
                        variant="outline-primary"
                        onChange={() => handleRadioChange(option.value)}
                    >
                        {option.label}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <p>Selected option: {selectedOption}</p>


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
                            <td>{row.layer}</td>
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
                            <td>{row.lambda}</td>
                            <td>{row.cost}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={5}>Outer Wall</td>
                    </tr>
                </tbody>
            </Table>
            <Button onClick={() => addRowWithDropdown('Inner Wall')}>Add Row with Dropdown</Button>
            <Button onClick={() => addRowWithDropdown('Outer Wall')}>Add Row with Dropdown</Button>
            <Button onClick={handleCalculate}>Calculate</Button>
            <div>{result}</div>
        </div>
    );
};

export default CustomTable;
