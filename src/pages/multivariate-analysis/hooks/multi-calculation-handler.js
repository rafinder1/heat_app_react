import { useState } from 'react';
export const useMultiCalculationHandlers = (inputTemp, rows, selectedTemp, inputPower) => {
    const [mvc, setMVC] = useState(null);

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
    return {
        mvc,
        handleCalculate,
    };
};