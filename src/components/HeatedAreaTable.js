import React from 'react';
import { Table } from 'react-bootstrap';

const HeatedAreaTable = () => (
    <>
        <h5>Heated Area (height 2.5 m)</h5>
        <Table striped bordered hover variant="light">
            <thead>
                <tr>
                    <th>Radiator power</th>
                    <th>* 80 W/m<sup>2</sup></th>
                    <th>** 120 W/m<sup>2</sup></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>250 W</td>
                    <td>3 m<sup>2</sup></td>
                    <td>2 m<sup>2</sup></td>
                </tr>
                <tr>
                    <td>500 W</td>
                    <td>4-6 m<sup>2</sup></td>
                    <td>4 m<sup>2</sup></td>
                </tr>
                <tr>
                    <td>750 W</td>
                    <td>7-9 m<sup>2</sup></td>
                    <td>5-6 m<sup>2</sup></td>
                </tr>
                <tr>
                    <td>1000 W</td>
                    <td>10-12 m<sup>2</sup></td>
                    <td>7-8 m<sup>2</sup></td>
                </tr>
                <tr>
                    <td>1300 W</td>
                    <td>13-16 m<sup>2</sup></td>
                    <td>9-11 m<sup>2</sup></td>
                </tr>
                <tr>
                    <td>1500 W</td>
                    <td>17-18 m<sup>2</sup></td>
                    <td>12-13 m<sup>2</sup></td>
                </tr>
                <tr>
                    <td>2000 W</td>
                    <td>19-25 m<sup>2</sup></td>
                    <td>14-17 m<sup>2</sup></td>
                </tr>
            </tbody>
        </Table>
        <p>* new buildings, rooms with good thermal insulation (80 W/m<sup>2</sup>)</p>
        <p>** old buildings, rooms with poorer thermal insulation (120 W/m<sup>2</sup>)</p>
    </>
);

export default HeatedAreaTable;