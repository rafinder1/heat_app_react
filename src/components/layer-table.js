import { Table } from 'react-bootstrap';

function LayerTable({ rows }) {
    return (
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
                {rows.length > 0 && rows.map((row, index) => (
                    <tr key={index}>
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
    );
}

export default LayerTable;