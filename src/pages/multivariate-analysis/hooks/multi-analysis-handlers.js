import { useState } from 'react';

export const useMultiAnalysisHandlers = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [materials, setMaterials] = useState();
    const [selectMaterial, setSetelectMaterial] = useState(null);
    const [manyThicknesses, setManyThickness] = useState();
    const [selectThickness, setSelectThickness] = useState(null);
    const [rows, setRows] = useState([]);

    const onSelect = (option) => {
        setSelectedOption(option);
        setSetelectMaterial(null);
        setSelectThickness(null);
    };

    const onSelectMaterial = (option) => {
        setSetelectMaterial(option);
        setSelectThickness(null);
    };

    const onSelectThickness = (option) => {
        setSelectThickness(parseFloat(option));
    };

    const handleMaterials = async () => {
        const response = await fetch(
            `http://127.0.0.1:8000/api/materials/filter?selected_type=${selectedOption}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );



        if (response.ok) {
            const materials = await response.json();
            setMaterials(materials);

        }
    };

    const handleThickness = async () => {
        if (materials !== undefined) {

            const response = await fetch(
                `http://127.0.0.1:8000/api/thickness_material/filter?selected_material=${selectMaterial}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.ok) {
                const manyThicknesses = await response.json();
                setManyThickness(manyThicknesses)
            }
        }
    };

    const handleAddLayer = () => {
        if (selectedOption !== null && selectMaterial !== null && selectThickness !== null) {
            manyThicknesses.forEach((element) => {
                if (
                    element.thickness === selectThickness
                ) {
                    const row = {
                        type_layer: selectedOption,
                        name_layer: selectMaterial,
                        thickness: selectThickness,
                        thermal_conductivity: element.thermal_conductivity,
                        cost: element.cost

                    }
                    setRows([...rows, row])
                }
            })
        }
    };

    const handleDelAllRows = () => {
        setRows([]);
    };

    return {
        selectedOption,
        materials,
        selectMaterial,
        manyThicknesses,
        selectThickness,
        rows,
        onSelect,
        onSelectMaterial,
        onSelectThickness,
        handleMaterials,
        handleThickness,
        handleAddLayer,
        handleDelAllRows,
    };
};