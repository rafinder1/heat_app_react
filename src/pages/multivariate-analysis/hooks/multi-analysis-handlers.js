import { useState } from 'react';

export const useMultiAnalysisHandlers = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [materials, setMaterials] = useState();
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
            let thickness = [];

            const response = await fetch(
                `http://127.0.0.1:8000/api/thickness_material/filter?selected_material=${selectMaterial}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log(response)
            if (response.ok) {
                const var_materials = await response.json();

                console.log(var_materials)
                // setMaterials(materials);

            }

            // if (selectMaterial !== null) {
            //     materials.material.forEach((element) => {
            //         if (element.fields.name_layer === selectMaterial) {
            //             thickness.push(element.fields.thickness);
            //         }
            //     });
            // }
            console.log(11111111111111)
            console.log(thickness)
            console.log(11111111111111)
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