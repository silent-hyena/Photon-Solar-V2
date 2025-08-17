// SolarChart.tsx
import {  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SolarChartProps {
  data: {
    month: string;
    val: number;
  }[];
}

const SolarChart = ({ data }: SolarChartProps) => {
  return (
    <div className="container mt-4 bg-white">
      <h4 className="text-center mt-5 mb-3">Average Monthly Irradiance Throughout The Year:</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis label={{ value: 'Radiation (kWh/m²/day)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="val" stroke="#82ca9d" name="Avg Radiation(kWh/m²/day)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SolarChart;
