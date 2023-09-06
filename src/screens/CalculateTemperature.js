import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

import CardHeader from '../components/CardHeader';
import ResultPlot from '../components/ResultPlot';
import LayersTable from '../components/LayersTable';
import TodoList from '../components/TodoList';
import InputField from '../components/InputField';
import HeatedAreaTable from '../components/HeatedAreaTable';
import ClimateZoneDropdown from '../components/ClimateZoneDropdown';
import BuildingConditionsSection from '../components/BuildingConditionsSection';

import { options } from '../CalculateTemperature/constans/Constans';
import useDataFetching from '../CalculateTemperature/hooks/DataFetching';
import useHandlers from '../CalculateTemperature/hooks/Handlers';


const CustomTable = () => {

    const data = useDataFetching();

    const {
        rows,
        result,
        selectedTemp,
        inputValue,
        selectedOption,
        todoList,
        handleLayerChange,
        handleCalculate,
        handleDropdownSelect,
        handleRadioChange,
        handleInputChange,
        addRowWithDropdown,
    } = useHandlers(data);

    const dropdownOptions = data.map(item => item.fields.name_layer);

    const getPlaceholderText = () => {
        switch (selectedOption) {
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
                    <TodoList todoList={todoList} />
                </Row>
                <br />
                <Row>
                    <LayersTable
                        rows={rows}
                        handleLayerChange={handleLayerChange}
                        dropdownOptions={dropdownOptions}
                    />
                </Row>
                <br />
                <Row className="d-flex justify-content-center mb-3">
                    <Button onClick={() => addRowWithDropdown()} style={{ width: '25%', margin: '10px' }}>
                        Add Layer
                    </Button>
                    <Button onClick={handleCalculate} style={{ width: '25%', margin: '10px' }} variant="success">
                        Calculate
                    </Button>
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
