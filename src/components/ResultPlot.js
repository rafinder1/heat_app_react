import React from 'react';
import Plot from 'react-plotly.js';

const ResultPlot = ({ scatterData }) => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Plot
            data={scatterData}
            layout={{
                title: 'Temperature Distribution',
                xaxis: { title: 'Thickness [m]' },
                yaxis: { title: 'Temperature [°C]' },
            }}
        />
    </div>
);

export default ResultPlot;