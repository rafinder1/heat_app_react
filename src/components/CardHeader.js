import React from 'react';
import { Card } from 'react-bootstrap';

const CardHeader = ({ title }) => (
    <Card.Header style={{ textAlign: 'center' }}>
        <h3>{title}</h3>
    </Card.Header>
);

export default CardHeader;