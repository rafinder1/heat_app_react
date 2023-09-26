import { useState } from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';

import CardHeader from '../../components/card-header';
import ClimateZoneDropdown from '../../components/climate-zone-dropdown';
import InputField from '../../components/input-field';

import { options } from '../../constans/constans';

import MaterialsDropdown from './components/material-dropdown';
import ThicknessDropdown from './components/thickness-dropdown';
import TypeMaterialDropdown from './components/type-material-dropdown';
import Tables from './components/layer-polystyrene-tables';

import useDropdownSelect from './hooks/useDropdownSelectCZD';
import useInputTemp from './hooks/useInputTemp';
import useInputPower from './hooks/useInputPower';
import useDataFetchingTypeMaterials from './hooks/useDataFetchingTypeMaterials';


function MultiAnalysis() {
    const { selectedTemp, handleDropdownSelect } = useDropdownSelect();
    const { inputTemp, handleInputTemp } = useInputTemp();
    const { inputPower, handleInputPower } = useInputPower();
    const typeMaterial = useDataFetchingTypeMaterials()


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


    return (
        <>
            <Card>
                <CardHeader title="Multivariate Analysis" />
                <Card.Body>

                    <Row>
                        <Col>
                            <ClimateZoneDropdown
                                selectedTemp={selectedTemp}
                                options={options}
                                onSelect={handleDropdownSelect}
                            />
                        </Col>

                        <Col>
                            <InputField
                                value={inputTemp}
                                onChange={handleInputTemp}
                                placeholder={'Temperature'}
                                header={'Expected Temperature [°C]'}
                            />
                        </Col>

                        <Col>
                            <InputField
                                value={inputPower}
                                onChange={handleInputPower}
                                placeholder={'Power Heater'}
                                header={'Power Heater [W/m2]'}
                            />
                        </Col>
                    </Row>
                    <br></br>
                    <Row>
                        <Col>
                            <TypeMaterialDropdown
                                selectedOption={selectedOption}
                                typeMaterial={typeMaterial}
                                onSelect={onSelect}
                            />
                            <MaterialsDropdown
                                selectMaterial={selectMaterial}
                                materials={materials}
                                uniqueMaterials={uniqueMaterials}
                                onSelectMaterial={onSelectMaterial}
                                handleMaterials={handleMaterials}
                            />
                            <ThicknessDropdown
                                selectThickness={selectThickness}
                                thickness={thickness}
                                onSelectThickness={onSelectThickness}
                                handleThickness={handleThickness}
                            />

                        </Col>
                        <Col className="d-flex align-items-center justify-content-center">

                            <Button variant="primary" onClick={handleAddLayer} style={{ width: '25%', margin: '10px' }}>Add Layer</Button >
                            <Button variant="danger" onClick={handleDelAllRows} style={{ width: '25%', margin: '10px' }}>Del All Layer</Button>
                            <Button variant="success" onClick={handleCalculate} style={{ width: '25%', margin: '10px' }}>Calculate</Button>

                        </Col>
                    </Row>
                    <br></br>
                    <Tables
                        rows={rows}
                        mvc={mvc}
                    />
                </Card.Body>
            </Card>
            <br></br>
            <Card>
                <CardHeader title="Count Amount Polystyrene" >
                </CardHeader>
                <Card.Body>
                    <InputField
                        value={null}
                        onChange={null}
                        placeholder={'Wall Surface'}
                        header={'Wall Surface [m2]'}
                    />
                </Card.Body>
            </Card>
        </>

    )
}

export default MultiAnalysis