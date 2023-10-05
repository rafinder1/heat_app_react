import React from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';

import CardHeader from '../../components/card-header';
import ClimateZoneDropdown from '../../components/climate-zone-dropdown';
import InputField from '../../components/input-field';

import { options } from '../../constans/constans';

import MaterialsDropdown from './components/material-dropdown';
import ThicknessDropdown from './components/thickness-dropdown';
import TypeMaterialDropdown from './components/type-material-dropdown';
import Tables from './components/layer-polystyrene-tables';

import useDropdownSelect from './hooks/use-dropdown-select-CZD';
import useInputTemp from './hooks/use-input-temp';
import useInputPower from './hooks/use-input-power';
import useDataFetchingTypeMaterials from './hooks/use-data-fetching-type-materials';
import { useMultiAnalysisHandlers } from './hooks/multi-analysis-handlers';
import { useMultiCalculationHandlers } from './hooks/multi-calculation-handler';



function MultiAnalysis() {
    const { selectedTemp, handleDropdownSelect } = useDropdownSelect();
    const { inputTemp, handleInputTemp } = useInputTemp();
    const { inputPower, handleInputPower } = useInputPower();
    const typeMaterial = useDataFetchingTypeMaterials()

    const {
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
    } = useMultiAnalysisHandlers();

    const {
        mvc,
        handleCalculate
    } = useMultiCalculationHandlers(inputTemp, rows, selectedTemp, inputPower);

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
                                onSelectMaterial={onSelectMaterial}
                                handleMaterials={handleMaterials}
                            />
                            <ThicknessDropdown
                                selectThickness={selectThickness}
                                thickness={manyThicknesses}
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
                        // value={ }
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