import { Table } from 'react-bootstrap';

function PolystyreneTable({ mvc }) {
    return (
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
                {mvc && mvc.length > 0 && mvc.map((row, index) => (
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
    );
}

export default PolystyreneTable;