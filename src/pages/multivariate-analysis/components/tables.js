import React from 'react';
import { Col, Row } from 'react-bootstrap';
import LayerTable from '../../../components/layer-table';
import PolystyreneTable from './polystyrene-table';

function Tables({ rows, mvc }) {
    return (
        <Row>
            <Col>
                <h5>Table 1. Layers in the building envelope</h5>
                <LayerTable
                    rows={rows}
                />

                <br></br>
                <h5>Table 2. Optimized polystyrene layers</h5>
                <PolystyreneTable
                    mvc={mvc}
                />


            </Col>
        </Row>
    );
}

export default Tables;