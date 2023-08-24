import React, { useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import data from './data.json'; // Replace with your JSON data

const CustomTable = () => {
    const [rows, setRows] = useState([]);

    const handleLayerChange = (index, selectedLayer) => {
        const newRows = [...rows];
        newRows[index].selectedLayer = selectedLayer;

        // Fetch corresponding data from JSON and update the row
        const matchingData = data.find(item => item.layer === selectedLayer);
        if (matchingData) {
            newRows[index].thickness = matchingData.thickness;
            newRows[index].lambda = matchingData.lambda;
            newRows[index].cost = matchingData.cost;
        }

        setRows(newRows);
    };

    const addRowWithDropdown = (layer) => {
        setRows([...rows, { layer, selectedLayer: '', thickness: '', lambda: '', cost: '' }]);
    };

    const dropdownOptions = data.map(item => item.layer); // Extract layer names from data

    return (
        <div>
            <Table striped bordered hover variant="light">
                <thead>
                    <tr>
                        <th>Type Layer</th>
                        <th>Name Layer</th>
                        <th>Thickness [m]</th>
                        <th>λ [W/mK]</th>
                        <th>Cost [PLN]</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={5}>Inner Wall</td>
                    </tr>
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>{row.layer}</td>
                            <td>
                                <Form.Control
                                    as="select"
                                    value={row.selectedLayer}
                                    onChange={e => handleLayerChange(index, e.target.value)}
                                >
                                    <option value="">Select Layer</option>
                                    {dropdownOptions.map(option => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </Form.Control>
                            </td>
                            <td>{row.thickness}</td>
                            <td>{row.lambda}</td>
                            <td>{row.cost}</td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={5}>Outer Wall</td>
                    </tr>
                </tbody>
            </Table>
            <Button onClick={() => addRowWithDropdown('Inner Wall')}>Add Row with Dropdown</Button>
            <Button onClick={() => addRowWithDropdown('Outer Wall')}>Add Row with Dropdown</Button>
        </div>
    );
};

export default CustomTable;
