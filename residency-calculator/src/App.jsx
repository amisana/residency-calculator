import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InteractiveResidencyModel = () => {
  // State for all financial parameters
  const [params, setParams] = useState({
    initialDebt: 500000,
    residentSalary: 60000,
    shortAttendingSalary: 300000,
    longAttendingSalary: 400000,
    livingExpenses: 50000,
    interestRate: 6.0,
    yearsToModel: 20
  });

  // Input ranges for sliders
  const ranges = {
    initialDebt: { min: 0, max: 1000000, step: 10000 },
    residentSalary: { min: 40000, max: 80000, step: 5000 },
    shortAttendingSalary: { min: 200000, max: 500000, step: 10000 },
    longAttendingSalary: { min: 300000, max: 600000, step: 10000 },
    livingExpenses: { min: 30000, max: 100000, step: 5000 },
    interestRate: { min: 0, max: 10, step: 0.1 },
    yearsToModel: { min: 10, max: 30, step: 1 }
  };

  // Calculate net worth over time
  const calculateNetWorth = (years, residencyLength, params) => {
    const netWorth = [-params.initialDebt];
    
    for (let year = 1; year <= years; year++) {
      const prevNetWorth = netWorth[year - 1];
      let newNetWorth;
      
      // During residency
      if (year <= residencyLength) {
        const income = params.residentSalary;
        if (prevNetWorth < 0) {
          const interestCost = Math.abs(prevNetWorth) * (params.interestRate / 100);
          newNetWorth = prevNetWorth + (income - params.livingExpenses) - interestCost;
        } else {
          newNetWorth = prevNetWorth + (income - params.livingExpenses);
        }
      }
      // Post residency as attending
      else {
        const income = residencyLength === 3 ? params.shortAttendingSalary : params.longAttendingSalary;
        if (prevNetWorth < 0) {
          const interestCost = Math.abs(prevNetWorth) * (params.interestRate / 100);
          newNetWorth = prevNetWorth + (income - params.livingExpenses) - interestCost;
        } else {
          newNetWorth = prevNetWorth + (income - params.livingExpenses);
        }
      }
      
      netWorth.push(newNetWorth);
    }
    
    return netWorth;
  };

  // Generate chart data
  const chartData = useMemo(() => {
    const shortPath = calculateNetWorth(params.yearsToModel, 3, params);
    const longPath = calculateNetWorth(params.yearsToModel, 7, params);
    
    const data = [];
    for (let i = 0; i <= params.yearsToModel; i++) {
      data.push({
        year: i,
        shortResidency: shortPath[i],
        longResidency: longPath[i]
      });
    }
    return data;
  }, [params]);

  // Find key metrics
  const metrics = useMemo(() => {
    const shortPath = calculateNetWorth(params.yearsToModel, 3, params);
    const longPath = calculateNetWorth(params.yearsToModel, 7, params);
    
    // Find break-even points
    const shortBreakEven = shortPath.findIndex(val => val >= 0);
    const longBreakEven = longPath.findIndex(val => val >= 0);
    
    // Find crossover point
    let crossover = null;
    for (let i = 8; i <= params.yearsToModel; i++) {
      if (longPath[i] > shortPath[i]) {
        crossover = i;
        break;
      }
    }
    
    return {
      shortBreakEven: shortBreakEven === -1 ? 'Never' : `Year ${shortBreakEven}`,
      longBreakEven: longBreakEven === -1 ? 'Never' : `Year ${longBreakEven}`,
      crossover: crossover ? `Year ${crossover}` : 'Never',
      shortFinal: shortPath[params.yearsToModel],
      longFinal: longPath[params.yearsToModel],
      advantage: longPath[params.yearsToModel] - shortPath[params.yearsToModel]
    };
  }, [params]);

  const formatCurrency = (value) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `$${Math.round(value / 1000)}K`;
    } else {
      return `$${Math.round(value)}`;
    }
  };

  const handleParamChange = (param, value) => {
    setParams(prev => ({
      ...prev,
      [param]: parseFloat(value) || 0
    }));
  };

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow">
          <p className="font-semibold">{`Year ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name === 'shortResidency' ? '3-Year Residency' : '7-Year Residency'}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Interactive Medical Residency Financial Model
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameter Controls */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Financial Parameters</h2>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-600">
                    Initial Debt
                  </label>
                  <span className="text-sm font-medium text-blue-600">
                    ${params.initialDebt.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={ranges.initialDebt.min}
                  max={ranges.initialDebt.max}
                  step={ranges.initialDebt.step}
                  value={params.initialDebt}
                  onChange={(e) => handleParamChange('initialDebt', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <input
                  type="number"
                  value={params.initialDebt}
                  onChange={(e) => handleParamChange('initialDebt', e.target.value)}
                  className="w-full mt-1 p-2 text-xs border rounded focus:ring-2 focus:ring-blue-500"
                  step={ranges.initialDebt.step}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-600">
                    Resident Salary
                  </label>
                  <span className="text-sm font-medium text-blue-600">
                    ${params.residentSalary.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={ranges.residentSalary.min}
                  max={ranges.residentSalary.max}
                  step={ranges.residentSalary.step}
                  value={params.residentSalary}
                  onChange={(e) => handleParamChange('residentSalary', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <input
                  type="number"
                  value={params.residentSalary}
                  onChange={(e) => handleParamChange('residentSalary', e.target.value)}
                  className="w-full mt-1 p-2 text-xs border rounded focus:ring-2 focus:ring-blue-500"
                  step={ranges.residentSalary.step}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-600">
                    3-Year Residency Attending Salary
                  </label>
                  <span className="text-sm font-medium text-blue-600">
                    ${params.shortAttendingSalary.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={ranges.shortAttendingSalary.min}
                  max={ranges.shortAttendingSalary.max}
                  step={ranges.shortAttendingSalary.step}
                  value={params.shortAttendingSalary}
                  onChange={(e) => handleParamChange('shortAttendingSalary', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <input
                  type="number"
                  value={params.shortAttendingSalary}
                  onChange={(e) => handleParamChange('shortAttendingSalary', e.target.value)}
                  className="w-full mt-1 p-2 text-xs border rounded focus:ring-2 focus:ring-blue-500"
                  step={ranges.shortAttendingSalary.step}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-600">
                    7-Year Residency Attending Salary
                  </label>
                  <span className="text-sm font-medium text-blue-600">
                    ${params.longAttendingSalary.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={ranges.longAttendingSalary.min}
                  max={ranges.longAttendingSalary.max}
                  step={ranges.longAttendingSalary.step}
                  value={params.longAttendingSalary}
                  onChange={(e) => handleParamChange('longAttendingSalary', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <input
                  type="number"
                  value={params.longAttendingSalary}
                  onChange={(e) => handleParamChange('longAttendingSalary', e.target.value)}
                  className="w-full mt-1 p-2 text-xs border rounded focus:ring-2 focus:ring-blue-500"
                  step={ranges.longAttendingSalary.step}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-600">
                    Annual Living Expenses
                  </label>
                  <span className="text-sm font-medium text-blue-600">
                    ${params.livingExpenses.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={ranges.livingExpenses.min}
                  max={ranges.livingExpenses.max}
                  step={ranges.livingExpenses.step}
                  value={params.livingExpenses}
                  onChange={(e) => handleParamChange('livingExpenses', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <input
                  type="number"
                  value={params.livingExpenses}
                  onChange={(e) => handleParamChange('livingExpenses', e.target.value)}
                  className="w-full mt-1 p-2 text-xs border rounded focus:ring-2 focus:ring-blue-500"
                  step={ranges.livingExpenses.step}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-600">
                    Interest Rate
                  </label>
                  <span className="text-sm font-medium text-blue-600">
                    {params.interestRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min={ranges.interestRate.min}
                  max={ranges.interestRate.max}
                  step={ranges.interestRate.step}
                  value={params.interestRate}
                  onChange={(e) => handleParamChange('interestRate', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <input
                  type="number"
                  value={params.interestRate}
                  onChange={(e) => handleParamChange('interestRate', e.target.value)}
                  className="w-full mt-1 p-2 text-xs border rounded focus:ring-2 focus:ring-blue-500"
                  step={ranges.interestRate.step}
                  min={ranges.interestRate.min}
                  max={ranges.interestRate.max}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-medium text-gray-600">
                    Years to Model
                  </label>
                  <span className="text-sm font-medium text-blue-600">
                    {params.yearsToModel} years
                  </span>
                </div>
                <input
                  type="range"
                  min={ranges.yearsToModel.min}
                  max={ranges.yearsToModel.max}
                  step={ranges.yearsToModel.step}
                  value={params.yearsToModel}
                  onChange={(e) => handleParamChange('yearsToModel', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <input
                  type="number"
                  value={params.yearsToModel}
                  onChange={(e) => handleParamChange('yearsToModel', e.target.value)}
                  className="w-full mt-1 p-2 text-xs border rounded focus:ring-2 focus:ring-blue-500"
                  min={ranges.yearsToModel.min}
                  max={ranges.yearsToModel.max}
                />
              </div>
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">Key Insights</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">3-Year Break-even:</span>
                <span className="font-medium">{metrics.shortBreakEven}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">7-Year Break-even:</span>
                <span className="font-medium">{metrics.longBreakEven}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Crossover Point:</span>
                <span className="font-medium">{metrics.crossover}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between">
                <span className="text-gray-600">Final Net Worth (3-Year):</span>
                <span className="font-medium">{formatCurrency(metrics.shortFinal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Final Net Worth (7-Year):</span>
                <span className="font-medium">{formatCurrency(metrics.longFinal)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-gray-700">7-Year Advantage:</span>
                <span className={metrics.advantage >= 0 ? "text-green-600" : "text-red-600"}>
                  {formatCurrency(metrics.advantage)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white p-4 border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Net Worth Trajectory</h3>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="year" 
                  label={{ value: 'Years Since Graduation', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  label={{ value: 'Net Worth', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={customTooltip} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="shortResidency" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="3-Year Residency"
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="longResidency" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="7-Year Residency"
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey={0}
                  stroke="#6b7280" 
                  strokeWidth={1}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
        <h4 className="font-semibold text-yellow-800 mb-2">Important Considerations</h4>
        <p className="text-sm text-yellow-700">
          This model provides a simplified financial comparison and doesn't account for factors like:
          taxes, investment returns, inflation, specialty-specific income variations, geographic differences,
          quality of life, or non-monetary career satisfaction. Use this as one tool among many when
          making residency decisions.
        </p>
      </div>
    </div>
  );
};

export default InteractiveResidencyModel;