import React from 'react';
// import SubNavBar from "./SubNavBar";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  useNavHistory,
  useFundAllocation,
  useMonthlyInvestments,
  useInvestmentValue,
} from '../../hooks/useChartData';
import '/src/index.css';

const COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#06b6d4', '#6366f1', '#ef4444'
];

function Charts() {
  const navHistory = useNavHistory();
  const fundAllocation = useFundAllocation();
  const monthlyInvestments = useMonthlyInvestments();
  const investmentValue = useInvestmentValue();

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

  const formatNavData = () => {
    if (!navHistory.data || navHistory.data.length === 0) return [];

    const groupedByDate = {};

    navHistory.data.forEach(item => {
      const date = new Date(item.trade_date).toLocaleDateString('en-GB');
      if (!groupedByDate[date]) {
        groupedByDate[date] = { date };
      }
      groupedByDate[date][item.name] = parseFloat(item.nav);
    });

    return Object.values(groupedByDate).sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA - dateB;
    });
  };

  const getFundNames = () => {
    if (!navHistory.data || navHistory.data.length === 0) return [];
    const names = [...new Set(navHistory.data.map(item => item.name))];
    return names;
  };

  const formatAllocationData = () => {
    if (!fundAllocation.data || fundAllocation.data.length === 0) return [];

    return fundAllocation.data.map(fund => ({
      name: fund.name,
      value: parseFloat(fund.current_value),
      units: parseFloat(fund.units_held),
    }));
  };


// Format monthly data for bar chart
const formatMonthlyData = () => {
  if (!monthlyInvestments.data || monthlyInvestments.data.length === 0) return [];

  return monthlyInvestments.data.map(item => {
    const date = new Date(item.month);
    const monthLabel = !isNaN(date)
      ? date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short' })
      : item.month;
    const total         = Number(item.count) || 0;

    return { month: monthLabel, total };
  });
};




  // Format investment value data with cumulative calculation
  const formatInvestmentValueData = () => {
    if (!investmentValue.data || investmentValue.data.length === 0) return [];

    let cumulative = 0;
    const formatted = investmentValue.data.map(item => {
      cumulative += parseFloat(item.td_value);
      return {
        date: new Date(item.trade_date).toLocaleDateString('en-GB'),
        value: cumulative,
        fund: item.name,
        formattedValue: fmt.format(cumulative),
      };
    });

    return formatted;
  };

  const navData = formatNavData();
  const fundNames = getFundNames();
  const allocationData = formatAllocationData();
  const monthlyData = formatMonthlyData();
  const valueData = formatInvestmentValueData();

  // Custom tooltip for currency formatting
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}:{' '}
            {typeof entry.value === 'number'
              ? fmt.format(entry.value)
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

  if (navHistory.loading || fundAllocation.loading ||
      monthlyInvestments.loading || investmentValue.loading) {
    return <div className="loading">Loading charts...</div>;
  }

  return (
    <>
    {/* <SubNavBar /> */}
      <div className="charts-page-container">
        <div className="profile-header">
          <div className="header-content">
            <h1 className="text-3xl font-bold mb-6">Investment Analytics</h1>
            <p className="page-subtitle">Review the performance of your investment</p>
          </div>
          </div>
          </div>

    <div className="chart-container">

      {/* NAV History Line Chart */}
      <div className="chart-section mb-8 p-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Fund NAV Development</h3>
        {navHistory.hasData ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={navData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {fundNames.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="empty-chart text-gray-500">Chart will be generated once you have placed your first order.</p>
        )}
      </div>


      {/* Investment Value Over Time */}
      <div className="chart-section mb-8 p-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Portfolio Value Development</h3>
        {investmentValue.hasData ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={valueData}
              margin={{ top: 20, right: 30, left: 80, bottom: 30 }}
              >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tickFormatter={(value) => fmt.format(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Total Value"
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="empty-chart text-gray-500">Chart will be generated once you have placed your first order.</p>
        )}
      </div>
    </div>
    </>
  );
}

export default Charts;