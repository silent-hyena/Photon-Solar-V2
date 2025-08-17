// SolarChart.tsx
import {  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SolarChartProps {
  data: {
    month: string;
    val: number;
  }[];
  eff: number,
  area: number
}

const EnergyChart = ({ data,eff,area }: SolarChartProps) => {
    // update value of each month-> val*eff*area*30
   
     const transformedData = data.map(item => ({
    ...item,
    val: (item.val * eff * area * 30).toFixed(0)
  }));
  return (
    <div className="container mt-4 bg-white">
      <h4 className="text-center mt-5 mb-3">Average Monthly Energy Generation: </h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis label={{ value: 'Electricity in KWh', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="val" stroke="#82ca9d" name="Energy Output(KWh)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyChart;
