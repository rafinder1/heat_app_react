import { useState } from 'react';

export const useMultiAnalysisHandlers = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [materials, setMaterials] = useState();
    const [uniqueMaterials, setUniqueMaterials] = useState();
    const [selectMaterial, setSetelectMaterial] = useState(null);
    const [thickness, setThickness] = useState();
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
        let response;
        if (selectedOption === 'ocieplenie') {
            response = await fetch('http://127.0.0.1:8000/api/thermal_isolation', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } else {
            response = await fetch(
                `http://127.0.0.1:8000/api/materials/filter?selected_type=${selectedOption}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
        }

        if (response.ok) {
            const materials = await response.json();
            setMaterials(materials);
            const uniqueMaterials = Array.from(
                new Set(materials.material.map((item) => item.fields.name_layer))
            );

            setUniqueMaterials(uniqueMaterials);
        }
    };

    const handleThickness = () => {
        if (materials !== undefined) {
            let thickness = [];

            if (selectMaterial !== null) {
                materials.material.forEach((element) => {
                    if (element.fields.name_layer === selectMaterial) {
                        thickness.push(element.fields.thickness);
                    }
                });
            }
            thickness.sort();
            setThickness(thickness);
        }
    };

    const handleAddLayer = () => {
        if (selectedOption !== null && selectMaterial !== null && selectThickness !== null) {
            materials.material.forEach((element) => {
                if (
                    element.fields.name_layer === selectMaterial &&
                    element.fields.thickness === selectThickness
                ) {
                    setRows([...rows, element.fields]);
                }
            });
        }
    };

    const handleDelAllRows = () => {
        setRows([]);
    };



    return {
        selectedOption,
        materials,
        uniqueMaterials,
        selectMaterial,
        thickness,
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