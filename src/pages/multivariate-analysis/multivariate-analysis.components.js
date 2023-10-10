import React from 'react';
import { Card, Col, Row, Button } from 'react-bootstrap';

import CardHeader from '../../components/card-header';
import ClimateZoneDropdown from '../../components/climate-zone-dropdown';
import InputField from '../../components/input-field';

import { options } from '../../constans/constans';

import MaterialsDropdown from '../../components/material-dropdown';
import ThicknessDropdown from '../../components/thickness-dropdown';
import TypeMaterialDropdown from '../../components/type-material-dropdown';
import Tables from './components/tables';
import TableAmountPrice from './components/table-with-amount-price';

import useDropdownSelect from './hooks/use-dropdown-select-CZD';
import useInputTemp from './hooks/use-input-temp';
import useInputPower from './hooks/use-input-power';
import useInputWallSurface from './hooks/use-input-wall-surface';
import useDataFetchingTypeMaterials from '../../hooks/use-data-fetching-type-materials';
import { useMultiAnalysisHandlers } from '../../hooks/multi-analysis-handlers';
import { useMultiCalculationHandlers } from './hooks/multi-calculation-handler';
import useCalculateAmountPrice from './hooks/calculation-amount-price-polystyrene';



function MultiAnalysis() {
    const { inputWallSurface, handleInputWallSurface } = useInputWallSurface();
    const { selectedTemp, handleDropdownSelect } = useDropdownSelect();
    const { inputTemp, handleInputTemp } = useInputTemp();
    const { inputPower, handleInputPower } = useInputPower();
    const typeMaterial = useDataFetchingTypeMaterials();

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

    const { amountPrice, handleCalculateAmountPrice } = useCalculateAmountPrice();

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
                            <Button
                                variant="primary"
                                onClick={handleAddLayer}
                                style={{ width: '25%', margin: '10px' }}
                            >Add Layer
                            </Button >
                            <Button
                                variant="danger"
                                onClick={handleDelAllRows}
                                style={{ width: '25%', margin: '10px' }}
                            >Del All Layer
                            </Button>
                            <Button
                                variant="success"
                                onClick={() => {
                                    if (rows.length > 0) {
                                        handleCalculate()
                                        if (inputTemp === '') {
                                            alert('Expected temperature was not defined, a default of 20 °C was assumed');
                                        }
                                        if (inputPower === '') {
                                            alert('Power heater was not defined, a default of 80 W/m2 was assumed');
                                        }
                                        if (selectedTemp === null) {
                                            alert('Climate Zone was not defined, a default of Zone III was assumed');
                                        }
                                        if (rows.length === 1) {
                                            if (rows[0].type_layer === 'ocieplenie') {
                                                alert('Only Styrofoam was selected, multi-variant analysis is not possible.');
                                            }
                                        }
                                    } else {
                                        alert('First Add Layer');
                                    }
                                }}
                                style={{ width: '25%', margin: '10px' }}
                            >Calculate
                            </Button>
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
                        value={inputWallSurface}
                        onChange={handleInputWallSurface}
                        placeholder={'Wall Surface'}
                        header={'Wall Surface [m2]'}
                    />
                    <Button
                        variant="success"
                        onClick={() => {
                            if (mvc !== null) {
                                if (inputWallSurface !== '') {
                                    handleCalculateAmountPrice(mvc, inputWallSurface);
                                }
                                else {
                                    alert('Wall Surface was not defined');
                                }
                            } else {
                                alert('First count the best Polystyrene');
                            }
                        }}
                        style={{ width: '25%', margin: '10px' }}
                    >
                        Calculate
                    </Button>
                    <TableAmountPrice
                        amountPrice={amountPrice}
                    />
                </Card.Body>
            </Card>
        </>

    )
}

export default MultiAnalysis