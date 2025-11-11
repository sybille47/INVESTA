import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFundAllocation } from '../../hooks/useChartData';

const COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#06b6d4', '#6366f1', '#ef4444'
];

function FundAllocationPieChart() {
  const { data, loading, error, hasData } = useFundAllocation();

  const fmt = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const unitFmt = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  });

  const formatAllocationData = () => {
    if (!data || data.length === 0) return [];

    return data.map(fund => ({
      name: fund.name,
      value: parseFloat(fund.current_value),
      units: parseFloat(fund.units_held),
      formattedValue: fmt.format(parseFloat(fund.current_value)),
      formattedUnits: unitFmt.format(parseFloat(fund.units_held)),
    }));
  };

  const allocationData = formatAllocationData();

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const fund = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold" size={12}>{fund.name}</p>
          <p style={{ color: payload[0].fill }} >
            Value: {fund.formattedValue}
          </p>
          <p className="text-gray-600">
            Units: {fund.formattedUnits}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="chart-section p-6 bg-white rounded-lg shadow">
        <div className="loading">Loading chart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-section p-6 bg-white rounded-lg shadow">
        <p className="text-red-500">Error loading chart: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="pie-chart-section p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Portfolio Allocation</h3>
      {hasData ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart
            margin={{ top: 20, right: 20, left: 20, bottom: 30 }}
            >
            <Pie
              data={allocationData}
              cx="53.0%"
              cy="47.0%"
              labelLine={false}
              label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(1)}%`
              }
              outerRadius={77.5}
              fill="#8884d8"
              dataKey="value"
            >
              {allocationData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No allocation data available</p>
      )}
    </div>
  );
}

export default FundAllocationPieChart;