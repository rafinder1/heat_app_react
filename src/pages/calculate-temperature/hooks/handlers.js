import { useState } from 'react';

const useHandlers = (rows) => {
    const [result, setResult] = useState([]);
    const [selectedTemp, setSelectedZone] = useState(null);
    const [inputValue, setInputValue] = useState();
    const [selectedHeat, setSelectedHeat] = useState('heat');

    const handleCalculate = async () => {
        const requestData = {
            data_building_partition: rows,
            heat_information: {
                inside_temperature: selectedHeat === 'heat' ? null : inputValue,
                outside_temperature: selectedTemp,
                inside_heater_power: selectedHeat === 'heat' ? inputValue : null,
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

            setResult(temp);
        } else {
            const result = "Handle error response"
            setResult(result)
        }
    };

    const handleDropdownSelect = (eventKey) => {

        const selectedTemperature = parseInt(eventKey.split(': ')[1]);

        setSelectedZone(selectedTemperature);
    };


    const handleRadioChange = (value) => {
        setSelectedHeat(value);
        setInputValue('');
    };

    const handleInputChange = (event) => {
        const inputValue = event.target.value;

        if (inputValue !== '') {
            const parsedValue = parseFloat(inputValue);

            if (!isNaN(parsedValue)) {
                setInputValue(parsedValue);
            } else {
                setInputValue('');
            }
        } else {
            setInputValue('');
        }
    };

    return {
        result,
        selectedTemp,
        inputValue,
        selectedHeat,
        handleDropdownSelect,
        handleRadioChange,
        handleInputChange,
        handleCalculate
    };
};

export default useHandlers;
