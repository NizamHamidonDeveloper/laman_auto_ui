'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';
import AdminHeader from './components/AdminHeader';
import AdminSidebar from './components/AdminSidebar';
import AdminFooter from './components/AdminFooter';
import Link from 'next/link';
import {
  Users,
  FileText,
  Car,
  Building2,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  ChevronDown,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Ticket,
  ArrowRight,
} from 'lucide-react';

// Enhanced dummy data for inventory tracking
const dummyData = {
  users: {
    total: 150,
    active: 120,
    new: 15,
  },
  loans: {
    total: 75,
    pending: 20,
    approved: 35,
    rejected: 10,
    submitted: 10,
  },
  vehicles: {
    total: 200,
    byBrand: [
      { 
        brand: 'Toyota', 
        count: 45,
        dealers: [
          { name: 'Toyota Dealer A', count: 20, threshold: 15 },
          { name: 'Toyota Dealer B', count: 15, threshold: 10 },
          { name: 'Toyota Dealer C', count: 10, threshold: 8 }
        ],
        trend: 'up',
        lastMonth: 40
      },
      { 
        brand: 'Honda', 
        count: 35,
        dealers: [
          { name: 'Honda Dealer A', count: 18, threshold: 12 },
          { name: 'Honda Dealer B', count: 17, threshold: 10 }
        ],
        trend: 'down',
        lastMonth: 38
      },
      { 
        brand: 'BMW', 
        count: 25,
        dealers: [
          { name: 'BMW Dealer A', count: 15, threshold: 8 },
          { name: 'BMW Dealer B', count: 10, threshold: 5 }
        ],
        trend: 'up',
        lastMonth: 22
      },
      { 
        brand: 'Mercedes', 
        count: 30,
        dealers: [
          { name: 'Mercedes Dealer A', count: 20, threshold: 12 },
          { name: 'Mercedes Dealer B', count: 10, threshold: 8 }
        ],
        trend: 'stable',
        lastMonth: 30
      },
      { 
        brand: 'Audi', 
        count: 20,
        dealers: [
          { name: 'Audi Dealer A', count: 12, threshold: 8 },
          { name: 'Audi Dealer B', count: 8, threshold: 5 }
        ],
        trend: 'up',
        lastMonth: 18
      },
    ],
  },
  transactions: {
    totalValue: 2500000,
    vehiclesSold: 45,
    loansApproved: 35,
    loansSubmitted: 25,
  },
};

// Add recent activity dummy data
const recentActivities = [
  {
    id: 1,
    type: 'loan',
    status: 'approved',
    user: 'John Doe',
    amount: 25000,
    vehicle: 'Toyota Camry 2023',
    timestamp: '2024-03-15T10:30:00',
    icon: <FileText className="h-5 w-5 text-green-500" />,
  },
  {
    id: 2,
    type: 'user',
    action: 'signup',
    user: 'Sarah Smith',
    email: 'sarah@example.com',
    timestamp: '2024-03-15T09:45:00',
    icon: <UserPlus className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 3,
    type: 'offer',
    action: 'redeem',
    user: 'Mike Johnson',
    code: 'SPRING2024',
    discount: '15%',
    timestamp: '2024-03-15T09:15:00',
    icon: <Ticket className="h-5 w-5 text-purple-500" />,
  },
  {
    id: 4,
    type: 'loan',
    status: 'pending',
    user: 'Emma Wilson',
    amount: 35000,
    vehicle: 'Honda Accord 2024',
    timestamp: '2024-03-15T08:30:00',
    icon: <FileText className="h-5 w-5 text-yellow-500" />,
  },
  {
    id: 5,
    type: 'user',
    action: 'signup',
    user: 'David Brown',
    email: 'david@example.com',
    timestamp: '2024-03-15T08:00:00',
    icon: <UserPlus className="h-5 w-5 text-blue-500" />,
  },
  {
    id: 6,
    type: 'offer',
    action: 'redeem',
    user: 'Lisa Anderson',
    code: 'WELCOME10',
    discount: '10%',
    timestamp: '2024-03-15T07:45:00',
    icon: <Ticket className="h-5 w-5 text-purple-500" />,
  },
  {
    id: 7,
    type: 'loan',
    status: 'rejected',
    user: 'Tom Harris',
    amount: 45000,
    vehicle: 'BMW X5 2024',
    timestamp: '2024-03-15T07:30:00',
    icon: <FileText className="h-5 w-5 text-red-500" />,
  },
];

const cardStyles = {
  base: "bg-white rounded-lg shadow p-6 transition-all duration-300 ease-in-out flex flex-col",
  hover: {
    users: "hover:bg-blue-50 hover:shadow-blue-100 hover:shadow-lg hover:-translate-y-1",
    loans: "hover:bg-green-50 hover:shadow-green-100 hover:shadow-lg hover:-translate-y-1",
    vehicles: "hover:bg-purple-50 hover:shadow-purple-100 hover:shadow-lg hover:-translate-y-1",
    transactions: "hover:bg-indigo-50 hover:shadow-indigo-100 hover:shadow-lg hover:-translate-y-1",
  },
  icon: {
    users: "bg-blue-100 text-blue-600",
    loans: "bg-green-100 text-green-600",
    vehicles: "bg-purple-100 text-purple-600",
    transactions: "bg-indigo-100 text-indigo-600",
  }
};

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loanApplications, setLoanApplications] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [showDealerDetails, setShowDealerDetails] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData } = await supabase.from('User').select('*');
      const { data: loanApplicationsData } = await supabase.from('LoanApplications').select('*');

      setUsers(usersData || []);
      setLoanApplications(loanApplicationsData || []);
    };
    fetchData();
  }, []);

  const getBrandCount = (brand: string) => {
    if (brand === 'all') {
      return dummyData.vehicles.total;
    }
    const brandData = dummyData.vehicles.byBrand.find(b => b.brand === brand);
    return brandData ? brandData.count : 0;
  };

  const getBrandData = (brand: string) => {
    if (brand === 'all') return null;
    return dummyData.vehicles.byBrand.find(b => b.brand === brand);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getLowInventoryDealers = (brand: string) => {
    const brandData = getBrandData(brand);
    if (!brandData) return [];
    return brandData.dealers.filter(dealer => dealer.count <= dealer.threshold);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
          
          {/* User Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/dashboard/user-management" className="block">
              <div className={`${cardStyles.base} ${cardStyles.hover.users}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Users</p>
                    <h3 className="text-2xl font-bold">{dummyData.users.total}</h3>
                  </div>
                  <div className={`p-3 rounded-full ${cardStyles.icon.users}`}>
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="font-semibold">{dummyData.users.active}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">New</p>
                    <p className="font-semibold">{dummyData.users.new}</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Loan Applications Summary */}
            <Link href="/dashboard/loan-applications" className="block">
              <div className={`${cardStyles.base} ${cardStyles.hover.loans}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Loan Applications</p>
                    <h3 className="text-2xl font-bold">{dummyData.loans.total}</h3>
                  </div>
                  <div className={`p-3 rounded-full ${cardStyles.icon.loans}`}>
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{dummyData.loans.pending} Pending</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{dummyData.loans.approved} Approved</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">{dummyData.loans.rejected} Rejected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Send className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{dummyData.loans.submitted} Submitted</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Loan Activity */}
            <Link href="/dashboard/loan-applications" className="block">
              <div className={`${cardStyles.base} ${cardStyles.hover.loans}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Loan Activity</p>
                    <h3 className="text-2xl font-bold">
                      {dummyData.transactions.loansApproved + dummyData.transactions.loansSubmitted}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-full ${cardStyles.icon.loans}`}>
                    <DollarSign className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Approved</p>
                    <p className="font-semibold">{dummyData.transactions.loansApproved}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="font-semibold">{dummyData.transactions.loansSubmitted}</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Transaction Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/dashboard/vehicle-management" className="block">
              <div className={`${cardStyles.base} ${cardStyles.hover.transactions}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Vehicles Sold</p>
                    <h3 className="text-2xl font-bold">{dummyData.transactions.vehiclesSold}</h3>
                  </div>
                  <div className={`p-3 rounded-full ${cardStyles.icon.transactions}`}>
                    <Building2 className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Total Value</p>
                  <p className="text-xl font-semibold">
                    ${dummyData.transactions.totalValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>

            {/* Enhanced Vehicle Inventory Summary */}
            <div className="block">
              <div className={`${cardStyles.base} ${cardStyles.hover.vehicles} ${
                showDealerDetails ? 'h-auto' : 'h-[200px]'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Vehicles</p>
                    <h3 className="text-2xl font-bold">{getBrandCount(selectedBrand)}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`p-3 rounded-full ${cardStyles.icon.vehicles}`}>
                      <Car className="h-6 w-6" />
                    </div>
                    <Link href="/dashboard/vehicle-inventory" className="text-purple-600 hover:text-purple-700">
                      <span className="text-sm">View All</span>
                    </Link>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="relative">
                    <select
                      value={selectedBrand}
                      onChange={(e) => {
                        setSelectedBrand(e.target.value);
                        setShowDealerDetails(false);
                      }}
                      className="w-full p-2 pr-8 text-sm border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Brands</option>
                      {dummyData.vehicles.byBrand.map((brand) => (
                        <option key={brand.brand} value={brand.brand}>
                          {brand.brand}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                  </div>

                  {selectedBrand !== 'all' && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Inventory Trend</span>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(getBrandData(selectedBrand)?.trend || '')}
                          <span className="font-medium">
                            {(() => {
                              const brandData = getBrandData(selectedBrand);
                              if (!brandData) return '';
                              return `${brandData.trend === 'up' ? '+' : ''}${brandData.count - brandData.lastMonth}`;
                            })()}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowDealerDetails(!showDealerDetails)}
                        className="mt-2 w-full text-left text-sm text-purple-600 hover:text-purple-700 flex items-center justify-between"
                      >
                        <span>{showDealerDetails ? 'Hide' : 'Show'} Dealer Details</span>
                        <ChevronDown 
                          className={`h-4 w-4 transition-transform duration-200 ${showDealerDetails ? 'transform rotate-180' : ''}`}
                        />
                      </button>

                      <div 
                        className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out ${
                          showDealerDetails ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className="space-y-2">
                          {getBrandData(selectedBrand)?.dealers.map((dealer) => (
                            <div 
                              key={dealer.name} 
                              className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-purple-50 transition-colors duration-200"
                            >
                              <span className="text-gray-600">{dealer.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className={dealer.count <= dealer.threshold ? 'text-red-500' : 'text-green-500'}>
                                  {dealer.count}
                                </span>
                                {dealer.count <= dealer.threshold && (
                                  <div className="flex items-center space-x-1">
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                    <span className="text-xs text-red-500">Low Stock</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {getLowInventoryDealers(selectedBrand).length > 0 && (
                          <div className="mt-3 p-2 bg-red-50 rounded-md border border-red-100">
                            <div className="flex items-center space-x-2">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              <p className="text-sm text-red-600">
                                {getLowInventoryDealers(selectedBrand).length} dealer(s) need attention
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Activity</h2>
                <Link href="/dashboard/activity" className="text-purple-600 hover:text-purple-700 text-sm flex items-center">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
              
              <div className="h-[400px] overflow-y-auto pr-2">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="mt-1">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.type === 'loan' && (
                              <>
                                Loan {activity.status === 'approved' ? 'Approved' : 
                                      activity.status === 'pending' ? 'Application' : 'Rejected'}
                              </>
                            )}
                            {activity.type === 'user' && 'New User Sign Up'}
                            {activity.type === 'offer' && 'Offer Code Redeemed'}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.type === 'loan' && (
                            <>
                              {activity.user} - {activity.vehicle}
                              <span className="ml-2 text-gray-500">
                                ${(activity as any).amount?.toLocaleString() ?? '0'}
                              </span>
                            </>
                          )}
                          {activity.type === 'user' && (
                            <>
                              {activity.user} ({activity.email})
                            </>
                          )}
                          {activity.type === 'offer' && (
                            <>
                              {activity.user} used code {activity.code} for {activity.discount} discount
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <AdminFooter />
    </div>
  );
} 