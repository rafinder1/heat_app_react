import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';

import CardHeader from '../../components/card-header';
import ResultPlot from './components/result-plot';
import LayersTable from './components/layers-table';
import TodoList from './components/todo-list';
import InputField from '../../components/input-field';
import HeatedAreaTable from './components/heated-area-table';
import ClimateZoneDropdown from '../../components/climate-zone-dropdown';
import BuildingConditionsSection from './components/building-conditions-section';

import { options } from '../../constans/constans';
import useDataFetching from './hooks/data-fetching';
import useHandlers from './hooks/handlers';


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
