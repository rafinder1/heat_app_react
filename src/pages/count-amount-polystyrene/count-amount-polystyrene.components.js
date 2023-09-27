import { Card } from 'react-bootstrap';

import CardHeader from '../../components/card-header';
import InputField from '../../components/input-field';

function CountAmountPolystyrene() {
    return (
        <>
            <Card>
                <CardHeader title="Count Amount Polystyrene" >
                </CardHeader>
                <Card.Body>
                    <InputField
                        value={null}
                        onChange={null}
                        placeholder={'Wall Surface'}
                        header={'Wall Surface [m2]'}
                    />
                </Card.Body>
            </Card>
        </>
    )
}

export default CountAmountPolystyrene