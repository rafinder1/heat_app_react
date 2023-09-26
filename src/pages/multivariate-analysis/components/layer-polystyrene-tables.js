import React from 'react';
import { Col, Row, Table } from 'react-bootstrap';

function Tables({ rows, mvc }) {
    return (
        <Row>
            <Col>
                <h5>Table 1. Layers in the building envelope</h5>
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
                            <tr key={index} >
                                <td>{row.type_layer}</td>
                                <td>{row.name_layer}</td>
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

                <br></br>
                <h5>Table 2. Optimized polystyrene layers</h5>

                <Table striped bordered hover variant="light">
                    <thead>
                        <tr>
                            <th>Name Layer</th>
                            <th>Thickness [m]</th>
                            <th>λ [W/mK]</th>
                            <th>Temperature [°C]</th>
                            <th>Cost [PLN]</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mvc && mvc.map((row, index) => (
                            <tr key={index}>
                                <td>{row.name_layer}</td>
                                <td>{row.thickness}</td>
                                <td>{row.thermal_conductivity}</td>
                                <td>{row.temperatures}</td>
                                <td>{row.cost}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Col>
        </Row>
    );
}

export default Tables;