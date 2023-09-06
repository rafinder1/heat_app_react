import { useState } from 'react';

const useHandlers = (data) => {
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

    const addRowWithDropdown = (name_layer) => {
        setRows([...rows, { type_layer: '', name_layer: '', thickness: '', thermal_conductivity: '', cost: '' }]);

        const updatedList = todoList.filter(item => item !== "Add Layer");
        setTodoList(updatedList);
    };

    return {
        rows,
        result,
        selectedTemp,
        inputValue,
        selectedOption,
        todoList,
        handleLayerChange,
        handleCalculate,
        handleDropdownSelect,
        handleRadioChange,
        handleInputChange,
        addRowWithDropdown

    };
};

export default useHandlers;
