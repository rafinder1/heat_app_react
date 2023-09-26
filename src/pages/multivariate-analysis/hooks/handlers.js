const [selectedOption, setSelectedOption] = useState(null);

const [materials, setMaterials] = useState();
const [uniqueMaterials, setUniqueMaterials] = useState();
const [selectMaterial, setSetelectMaterial] = useState(null);
const [thickness, setThickness] = useState();
const [selectThickness, setSelectThickness] = useState(null);
const [rows, setRows] = useState([]);
const [mvc, setMVC] = useState(null);



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

    let response

    if (selectedOption === 'ocieplenie') {
        response = await fetch('http://127.0.0.1:8000/api/thermal_isolation', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } else {
        response = await fetch(`http://127.0.0.1:8000/api/materials/filter?selected_type=${selectedOption}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    if (response.ok) {
        const materials = await response.json();
        setMaterials(materials);
        const uniqueMaterials = Array.from(new Set(materials.material.map(item => item.fields.name_layer)));

        setUniqueMaterials(uniqueMaterials)
    }


}





const handleThickness = () => {
    if (materials !== undefined) {

        let thickness = [];

        if (selectMaterial !== null) {
            materials.material.forEach(element => {
                if (element.fields.name_layer === selectMaterial) {
                    thickness.push(element.fields.thickness)
                }
            })

        }
        thickness.sort()
        setThickness(thickness);
    }


}


const handleAddLayer = () => {
    if (selectedOption !== null && selectMaterial !== null && selectThickness !== null) {


        materials.material.forEach(element => {
            if (element.fields.name_layer === selectMaterial && element.fields.thickness === selectThickness) {
                setRows([...rows, element.fields])
            }
        })
    }
}

const handleDelAllRows = () => {
    setRows([])
}

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