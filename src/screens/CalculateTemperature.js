import React from 'react';
import { Button } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';


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
        if (selectedOption === 'heat') {
            return 'Power Heater [W/m2]';
        } else if (selectedOption === 'temp') {
            return 'Temperature [°C]';
        }
        return 'Enter value';
    };

    const scatterData = [
        {
            x: result.thickness,
            y: result.temp,
            mode: 'markers+lines',
            type: 'scatter',
        },
    ];

    return (
        <div>
            <Card>
                <CardHeader title="Basic Partition Data" />
                <Card.Body>

                    <Row>
                        <Col>

                            <ClimateZoneDropdown selectedTemp={selectedTemp} options={options} onSelect={handleDropdownSelect} />

                            <br />

                            <BuildingConditionsSection handleRadioChange={handleRadioChange} />

                        </Col>

                        <Col>

                            <HeatedAreaTable />

                            <br />

                            <InputField value={inputValue} onChange={handleInputChange} placeholder={getPlaceholderText()} />

                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <br />
            <Card>

                <CardHeader title="Layers of Building Partition" />

                <Card.Body>

                    <Row>

                        <TodoList todoList={todoList} />

                    </Row>

                    <br />

                    <Row>

                        <LayersTable rows={rows} handleLayerChange={handleLayerChange} dropdownOptions={dropdownOptions} />

                    </Row>

                    <br />

                    <Row className="d-flex justify-content-center mb-3">

                        <Button onClick={() => addRowWithDropdown()} style={{ width: '25%', margin: '10px' }}>Add Layer</Button>
                        <Button onClick={handleCalculate} style={{ width: '25%', margin: '10px' }} variant="success">Calculate</Button>

                    </Row>

                    <br />

                    <Row>

                        <ResultPlot scatterData={scatterData} />

                    </Row>

                </Card.Body>
            </Card>
        </div >
    );
};

export default CustomTable;
