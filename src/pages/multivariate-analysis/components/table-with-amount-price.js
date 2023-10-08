import { Table } from 'react-bootstrap';

function TableAmountPrice({ amountPrice }) {
    return (
        <Table striped bordered hover variant="light">
            <thead>
                <tr>
                    <th>Name Layer</th>
                    <th>Thickness [m]</th>
                    <th>Price Building [PLN]</th>
                    <th>Package [pcs.]</th>
                </tr>
            </thead>
            <tbody>
                {amountPrice && amountPrice.map((row, index) => (
                    <tr key={index}>
                        <td>{row.name_layer}</td>
                        <td>{row.thickness}</td>
                        <td>{row.price_building}</td>
                        <td>{row.package}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default TableAmountPrice;