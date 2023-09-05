import React from 'react';
import { Form } from 'react-bootstrap';

const InputField = ({ value, onChange, placeholder }) => (
    <>
        <h5>Enter Value: </h5>
        <Form.Group controlId="inputField">
            <Form.Control
                type="number"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </Form.Group>
    </>
);

export default InputField;