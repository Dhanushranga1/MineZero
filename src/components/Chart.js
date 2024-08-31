import { Line } from 'react-chartjs-2';
import styled from 'styled-components';

const ChartWrapper = styled.div`
    margin: 30px auto;
    padding: 20px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 800px;
`;

export default function EmissionChart({ data }) {
    const chartData = {
        labels: ['Excavation', 'Transportation', 'Equipment Usage'],
        datasets: [
            {
                label: 'Emissions (in tons)',
                data: data,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }
        ]
    };

    return (
        <ChartWrapper>
            <h2>Emission Data Visualization</h2>
            <Line data={chartData} />
        </ChartWrapper>
    );
}
