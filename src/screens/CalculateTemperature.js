import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';


import CardHeader from '../components/CardHeader';
import ResultPlot from '../components/ResultPlot';
import LayersTable from '../components/LayersTable';
import TodoList from '../components/TodoList';
import InputField from '../components/InputField';
import HeatedAreaTable from '../components/HeatedAreaTable';
import ClimateZoneDropdown from '../components/ClimateZoneDropdown';
import BuildingConditionsSection from '../components/BuildingConditionsSection';

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
                <CardHeader title="Basic Partition Data" />
                <Card.Body>

                    <Row>
                        <Col>

                            <ClimateZoneDropdown selectedTemp={selectedTemp} options={options} onSelect={handleDropdownSelect} />

                            <br />

                            <BuildingConditionsSection handleRadioChange={handleRadioChange} />

                        </Col>

                        <Col>

                            <HeatedAreaTable />

                            <br />

                            <InputField value={inputValue} onChange={handleInputChange} placeholder={getPlaceholderText()} />

                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <br />
            <Card>

                <CardHeader title="Layers of Building Partition" />

                <Card.Body>

                    <Row>

                        <TodoList todoList={todoList} />

                    </Row>

                    <br />

                    <Row>

                        <LayersTable rows={rows} handleLayerChange={handleLayerChange} dropdownOptions={dropdownOptions} />

                    </Row>

                    <br />

                    <Row className="d-flex justify-content-center mb-3">

                        <Button onClick={() => addRowWithDropdown()} style={{ width: '25%', margin: '10px' }}>Add Layer</Button>
                        <Button onClick={handleCalculate} style={{ width: '25%', margin: '10px' }} variant="success">Calculate</Button>

                    </Row>

                    <br />

                    <Row>

                        <ResultPlot scatterData={scatterData} />

                    </Row>

                </Card.Body>
            </Card>
        </div >
    );
};

export default CustomTable;
