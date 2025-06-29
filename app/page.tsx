"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Target, TrendingUp, Calendar, Home, PiggyBank, GraduationCap, Car, Heart, Menu, X } from 'lucide-react';

const FinancialPlanningApp = () => {
  const [activeTab, setActiveTab] = useState('retirement');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Retirement Planning State
  const [goalAmount, setGoalAmount] = useState(100000);
  const [currentSavings, setCurrentSavings] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [timeHorizon, setTimeHorizon] = useState(10);
  const [stockAllocation, setStockAllocation] = useState(70);
  const [bondAllocation, setBondAllocation] = useState(30);
  const [projectionData, setProjectionData] = useState<Array<{
    year: string;
    balance: number;
    contributions: number;
    growth: number;
  }>>([]);
  const [totalProjected, setTotalProjected] = useState(0);
  const [monthsToGoal, setMonthsToGoal] = useState(0);

  // Home Buying State
  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(20);
  const [currentHomeSavings, setCurrentHomeSavings] = useState(15000);
  const [monthlyHomeSavings, setMonthlyHomeSavings] = useState(800);
  const [homeTimeframe, setHomeTimeframe] = useState(5);

  // Emergency Fund State
  const [monthlyExpenses, setMonthlyExpenses] = useState(4000);
  const [emergencyMonths, setEmergencyMonths] = useState(6);
  const [currentEmergencyFund, setCurrentEmergencyFund] = useState(5000);
  const [monthlyEmergencySavings, setMonthlyEmergencySavings] = useState(300);

  const planningTabs: Array<{
    id: string;
    name: string;
    icon: React.ComponentType<any>;
    color: string;
  }> = [
    { id: 'retirement', name: 'Retirement Goals', icon: Target, color: 'blue' },
    { id: 'home', name: 'Home Buying', icon: Home, color: 'green' },
    { id: 'emergency', name: 'Emergency Fund', icon: PiggyBank, color: 'purple' },
    { id: 'education', name: 'Education', icon: GraduationCap, color: 'orange' },
    { id: 'vacation', name: 'Vacation Fund', icon: Car, color: 'pink' }
  ];

  // Expected returns (annual)
  const stockReturn = 0.10; // 10%
  const bondReturn = 0.04; // 4%

  useEffect(() => {
    if (activeTab === 'retirement') {
      calculateRetirementProjections();
    }
  }, [goalAmount, currentSavings, monthlyContribution, timeHorizon, stockAllocation, bondAllocation, activeTab]);

  const calculateRetirementProjections = () => {
    const years = timeHorizon;
    const months = years * 12;
    const weightedReturn = (stockAllocation / 100 * stockReturn) + (bondAllocation / 100 * bondReturn);
    const monthlyReturn = weightedReturn / 12;
    
    const data = [];
    let balance = currentSavings;
    let goalReached = false;
    let monthsToReachGoal = 0;

    for (let month = 0; month <= months; month++) {
      if (month > 0) {
        balance += monthlyContribution;
        balance = balance * (1 + monthlyReturn);
      }

      if (balance >= goalAmount && !goalReached) {
        goalReached = true;
        monthsToReachGoal = month;
      }

      data.push({
        year: (month / 12).toFixed(1),
        balance: Math.round(balance),
        contributions: currentSavings + (monthlyContribution * month),
        growth: Math.round(balance - currentSavings - (monthlyContribution * month))
      });
    }

    setProjectionData(data);
    setTotalProjected(Math.round(balance));
    setMonthsToGoal(monthsToReachGoal);
  };

  const allocationData = [
    { name: 'Stocks', value: stockAllocation, color: '#10B981' },
    { name: 'Bonds', value: bondAllocation, color: '#3B82F6' }
  ];

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatYears = (months: number): string => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years === 0) return `${remainingMonths} months`;
    if (remainingMonths === 0) return `${years} years`;
    return `${years} years, ${remainingMonths} months`;
  };

  const getTabColor = (tabId: string): string => {
    const tab = planningTabs.find(t => t.id === tabId);
    return tab?.color || 'blue';
  };

  const renderRetirementPlanning = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Panel - Inputs */}
      <div className="lg:col-span-1 space-y-6">
        {/* Goal Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Target className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Retirement Goal</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Amount
              </label>
              <input
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">{formatCurrency(goalAmount)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Savings
              </label>
              <input
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">{formatCurrency(currentSavings)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Contribution
              </label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">{formatCurrency(monthlyContribution)}/month</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Horizon (Years)
              </label>
              <input
                type="range"
                min="1"
                max="40"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-1">{timeHorizon} years</p>
            </div>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Asset Allocation</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stocks: {stockAllocation}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={stockAllocation}
                onChange={(e) => {
                  const stocks = Number(e.target.value);
                  setStockAllocation(stocks);
                  setBondAllocation(100 - stocks);
                }}
                className="w-full"
              />
              <p className="text-sm text-gray-500">Expected return: 10% annually</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bonds: {bondAllocation}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={bondAllocation}
                onChange={(e) => {
                  const bonds = Number(e.target.value);
                  setBondAllocation(bonds);
                  setStockAllocation(100 - bonds);
                }}
                className="w-full"
              />
              <p className="text-sm text-gray-500">Expected return: 4% annually</p>
            </div>
          </div>

          {/* Allocation Pie Chart */}
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-2">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                <span className="text-sm">Stocks</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span className="text-sm">Bonds</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Results */}
      <div className="lg:col-span-2 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Projected Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalProjected)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Time to Goal</p>
                <p className="text-2xl font-bold text-gray-900">
                  {monthsToGoal > 0 ? formatYears(monthsToGoal) : 'Not reached'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Goal Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.min(100, Math.round((totalProjected / goalAmount) * 100))}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Growth Projection</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="year" 
                label={{ value: 'Years', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={(value: any, name: string) => [formatCurrency(Number(value)), name]}
                labelFormatter={(label: string) => `Year ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Total Balance"
              />
              <Line 
                type="monotone" 
                dataKey="contributions" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Total Contributions"
              />
              <Line 
                type="monotone" 
                dataKey="growth" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                name="Investment Growth"
              />
            </LineChart>
          </ResponsiveContainer>
          
          {/* Goal Line Indicator */}
          {monthsToGoal > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 font-medium">
                🎯 You'll reach your goal of {formatCurrency(goalAmount)} in {formatYears(monthsToGoal)}!
              </p>
            </div>
          )}
          
          {monthsToGoal === 0 && totalProjected < goalAmount && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 font-medium">
                ⚠️ You'll have {formatCurrency(totalProjected)} after {timeHorizon} years. 
                Consider increasing contributions or extending the timeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderHomeBuying = () => {
    const downPaymentAmount = (homePrice * downPayment) / 100;
    const monthsNeeded = Math.ceil((downPaymentAmount - currentHomeSavings) / monthlyHomeSavings);
    const yearsNeeded = monthsNeeded / 12;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Home className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Home Purchase Details</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Home Price</label>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">{formatCurrency(homePrice)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment: {downPayment}%</label>
              <input
                type="range"
                min="5"
                max="25"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-500">{formatCurrency(downPaymentAmount)} needed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Savings</label>
              <input
                type="number"
                value={currentHomeSavings}
                onChange={(e) => setCurrentHomeSavings(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Savings</label>
              <input
                type="number"
                value={monthlyHomeSavings}
                onChange={(e) => setMonthlyHomeSavings(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Timeline to Purchase</h3>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-lg font-semibold text-green-800">
                🏠 You can buy your home in {yearsNeeded.toFixed(1)} years
              </p>
              <p className="text-sm text-green-600">
                That's {monthsNeeded} months of saving {formatCurrency(monthlyHomeSavings)}/month
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Still Need</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(Math.max(0, downPaymentAmount - currentHomeSavings))}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((currentHomeSavings / downPaymentAmount) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmergencyFund = () => {
    const emergencyGoal = monthlyExpenses * emergencyMonths;
    const stillNeeded = Math.max(0, emergencyGoal - currentEmergencyFund);
    const monthsToComplete = stillNeeded > 0 ? Math.ceil(stillNeeded / monthlyEmergencySavings) : 0;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <PiggyBank className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Emergency Fund Setup</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Expenses</label>
              <input
                type="number"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Months to Cover: {emergencyMonths}</label>
              <input
                type="range"
                min="3"
                max="12"
                value={emergencyMonths}
                onChange={(e) => setEmergencyMonths(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-500">Goal: {formatCurrency(emergencyGoal)}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Emergency Fund</label>
              <input
                type="number"
                value={currentEmergencyFund}
                onChange={(e) => setCurrentEmergencyFund(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Savings</label>
              <input
                type="number"
                value={monthlyEmergencySavings}
                onChange={(e) => setMonthlyEmergencySavings(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Emergency Fund Status</h3>
          <div className="space-y-4">
            {stillNeeded > 0 ? (
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-lg font-semibold text-purple-800">
                  🎯 Complete your emergency fund in {Math.ceil(monthsToComplete)} months
                </p>
                <p className="text-sm text-purple-600">
                  Save {formatCurrency(monthlyEmergencySavings)}/month to reach your goal
                </p>
              </div>
            ) : (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-lg font-semibold text-green-800">
                  ✅ Emergency fund complete!
                </p>
                <p className="text-sm text-green-600">You're financially secure</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Still Need</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stillNeeded)}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((currentEmergencyFund / emergencyGoal) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderComingSoon = (title: string) => (
    <div className="text-center py-16">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">This planning tool is coming soon! We're working hard to bring you comprehensive financial planning features.</p>
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-500">Want to be notified when this feature launches?</p>
          <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Join Waitlist
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'retirement':
        return renderRetirementPlanning();
      case 'home':
        return renderHomeBuying();
      case 'emergency':
        return renderEmergencyFund();
      case 'education':
        return renderComingSoon('Education Planning');
      case 'vacation':
        return renderComingSoon('Vacation Fund Planning');
      default:
        return renderRetirementPlanning();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                    <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">PlanFinanceToday</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {planningTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? `bg-${tab.color}-100 text-${tab.color}-700 border border-${tab.color}-200` 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-2 border-t border-gray-200">
              {planningTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium ${
                      isActive 
                        ? `bg-${tab.color}-50 text-${tab.color}-700 border-r-2 border-${tab.color}-600` 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            {(() => {
              const currentTab = planningTabs.find(tab => tab.id === activeTab);
              const Icon = currentTab?.icon || Target;
              return <Icon className={`h-8 w-8 text-${currentTab?.color || 'blue'}-600 mr-3`} />;
            })()}
            <h1 className="text-3xl font-bold text-gray-900">
              {planningTabs.find(tab => tab.id === activeTab)?.name || 'Financial Planning'}
            </h1>
          </div>
          <p className="text-gray-600">
            {activeTab === 'retirement' && "Plan for your retirement with personalized projections and investment strategies"}
            {activeTab === 'home' && "Calculate how long it will take to save for your dream home"}
            {activeTab === 'emergency' && "Build a safety net to protect against unexpected expenses"}
            {activeTab === 'education' && "Save for education expenses with tax-advantaged strategies"}
            {activeTab === 'vacation' && "Plan and save for your next vacation or travel goals"}
          </p>
        </div>

        {/* Content Area */}
        {renderContent()}

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>This tool provides estimates based on historical market averages. Past performance doesn't guarantee future results.</p>
          <p className="mt-2">© 2025 PlanFinanceToday. Built with ❤️ for your financial success.</p>
        </div>
      </div>
    </div>
  );
};

export default FinancialPlanningApp;