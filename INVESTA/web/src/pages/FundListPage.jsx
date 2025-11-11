import React from 'react';
import FundList from '../component/data/FundList';
import SubNavBar from '../component/data/SubNavBar';
import PieChart from '../component/data/PieChart';
import { useFundTotal } from '../hooks/useFundTotal';
// import "../fundList.css";

function FundListPage() {
  const { totalValue, loading, error, hasData } = useFundTotal();

  return (
    <div className="page-container">
      {/* <SubNavBar /> */}

      <div className="content-wrapper max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Your Fund Portfolio</h1>

        {/* Total Value Display */}
        <div className="total-value-card bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg mb-6">
          <p className="text-sm font-medium opacity-90">Total Portfolio Value</p>
          {loading ? (
            <p className="text-3xl font-bold mt-2">Loading...</p>
          ) : error ? (
            <p className="text-xl text-red-200 mt-2">Error loading total</p>
          ) : (
            <p className="text-4xl font-bold mt-2">
              €{parseFloat(totalValue).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          )}
          {!loading && !hasData && !error && (
            <p className="text-sm opacity-75 mt-2">No investments yet</p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fund List */}
          <div className="fund-list-container">
            <FundList />
          </div>

          {/* Pie Chart */}
          <div className="pie-chart-container">
            <PieChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default FundListPage;
