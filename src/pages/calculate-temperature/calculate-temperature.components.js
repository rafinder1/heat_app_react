import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

import CardHeader from '../../components/card-header';
import ResultPlot from './components/result-plot';
import InputField from '../../components/input-field';
import HeatedAreaTable from './components/heated-area-table';
import ClimateZoneDropdown from '../../components/climate-zone-dropdown';
import BuildingConditionsSection from './components/building-conditions-section';
import TypeMaterialDropdown from '../multivariate-analysis/components/type-material-dropdown';
import MaterialsDropdown from '../multivariate-analysis/components/material-dropdown';
import ThicknessDropdown from '../multivariate-analysis/components/thickness-dropdown';
import LayerTable from '../multivariate-analysis/components/layer-table';

import { options } from '../../constans/constans';
import useHandlers from './hooks/handlers';
import useDataFetchingTypeMaterials from '../multivariate-analysis/hooks/use-data-fetching-type-materials';
import { useMultiAnalysisHandlers } from '../multivariate-analysis/hooks/multi-analysis-handlers';


const CustomTable = () => {
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
        result,
        selectedTemp,
        inputValue,
        selectedHeat,
        handleDropdownSelect,
        handleRadioChange,
        handleInputChange,
        handleCalculate
    } = useHandlers(rows);

    const getPlaceholderText = () => {
        switch (selectedHeat) {
            case 'heat':
                return 'Power Heater [W/m2]';
            case 'temp':
                return 'Temperature [°C]';
            default:
                return 'Enter value';
        }
    };

    const scatterData = [
        {
            x: result.thickness,
            y: result.temp,
            mode: 'markers+lines',
            type: 'scatter',
        },
    ];

    const renderBasicPartitionData = () => (
        <Card>
            <CardHeader title="Basic Partition Data" />
            <Card.Body>
                <Row>
                    <Col>
                        <ClimateZoneDropdown
                            selectedTemp={selectedTemp}
                            options={options}
                            onSelect={handleDropdownSelect}
                        />
                        <br />
                        <BuildingConditionsSection handleRadioChange={handleRadioChange} />
                    </Col>
                    <Col>
                        <HeatedAreaTable />
                        <br />
                        <InputField
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder={getPlaceholderText()}
                            header={getPlaceholderText()}
                        />
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );

    const renderLayersOfBuildingPartition = () => (
        <Card>
            <CardHeader title="Layers of Building Partition" />
            <Card.Body>
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
                        <Button onClick={handleCalculate} style={{ width: '25%', margin: '10px' }} variant="success">
                            Calculate
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <LayerTable
                        rows={rows}
                    />
                </Row>
                <br />
                <Row>
                    <ResultPlot scatterData={scatterData} />
                </Row>
            </Card.Body>
        </Card>
    );

    return (
        <>
            {renderBasicPartitionData()}
            <br />
            {renderLayersOfBuildingPartition()}
        </>
    );
};

export default CustomTable;
