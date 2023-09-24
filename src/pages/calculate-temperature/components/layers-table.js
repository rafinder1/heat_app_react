import React from 'react';
import { Table, Form } from 'react-bootstrap';

const LayersTable = ({ rows, handleLayerChange, dropdownOptions }) => (
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
                    <td>{row.type_layer}</td>
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
                    <td>{row.thermal_conductivity}</td>
                    <td>{row.cost}</td>
                </tr>
            ))}
            <tr>
                <td colSpan={5}>Outer Wall</td>
            </tr>
        </tbody>
    </Table>
);

export default LayersTable;