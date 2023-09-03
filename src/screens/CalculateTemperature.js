import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Dropdown, ButtonGroup } from 'react-bootstrap';
import Plot from 'react-plotly.js';

const CustomTable = () => {
    const [data, setData] = useState([]);
    const [rows, setRows] = useState([]);
    const [result, setResult] = useState([]);
    const [selectedTemp, setSelectedZone] = useState(null);
    const [inputValue, setInputValue] = useState();
    const [selectedOption, setSelectedOption] = useState('heat');
    const [todoList, setTodoList] = useState([
        "Select Zone",
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

        const updatedList = todoList.filter(item => item !== "Select Zone");
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
            return 'Power Heater';
        } else if (selectedOption === 'temp') {
            return 'Temperature';
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

    console.log(selectedTemp)
    return (
        <div>
            <Dropdown onSelect={handleDropdownSelect} >
                <Dropdown.Toggle variant="light" style={{ width: '335px' }}>
                    {selectedTemp !== null
                        ? `external temperature: ${selectedTemp} °C`
                        : 'Select Temperature'}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    {options.map(option => (
                        <Dropdown.Item key={option.value} eventKey={option.value}>
                            {option.label}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>


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

            <img
                src={`${process.env.PUBLIC_URL}/heater_choose.png`} // Use the PUBLIC_URL to reference the image
                alt="Heater Choose"
                className="img-fluid"
            />

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
            {/* <div>{result}</div> */}

            <div>
                <h2>ToDo List</h2>
                <ul>
                    {todoList.map((item, index) => (
                        <li key={index}>{item}</li>
                    ))}
                </ul>
                {todoList.length === 0 && <p>You can calculate</p>}
            </div>

            <Plot
                data={scatterData}
                layout={{ title: 'Scatter Plot' }}
            />
        </div>
    );
};

export default CustomTable;
