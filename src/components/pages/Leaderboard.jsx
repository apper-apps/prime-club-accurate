import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSalesReps } from "@/services/api/salesRepService";
import ApperIcon from "@/components/ApperIcon";
import Leads from "@/components/pages/Leads";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const Leaderboard = () => {
const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
const [lastUpdated, setLastUpdated] = useState(null);
  
  const loadSalesReps = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError("");
      
      const data = await getSalesReps();
      // Enhanced performance score calculation with conversion rate
// Enhanced performance score calculation with conversion rate
      const sortedReps = data.sort((a, b) => {
        // Weighted scoring: conversion rate (4x), deals closed (3x), meetings booked (2x), leads contacted (1x)
        const scoreA = (a.conversion_rate_c || 0) * 4 + a.deals_closed_c * 3 + a.meetings_booked_c * 2 + a.leads_contacted_c;
        const scoreB = (b.conversion_rate_c || 0) * 4 + b.deals_closed_c * 3 + b.meetings_booked_c * 2 + b.leads_contacted_c;
        return scoreB - scoreA;
      });
      setSalesReps(sortedReps);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error loading sales reps:", err);
      setError("Failed to load sales reps data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadSalesReps(true);
  };

useEffect(() => {
    loadSalesReps();
    
    // Set up automatic refresh every 5 minutes
    const refreshInterval = setInterval(() => {
      loadSalesReps(true);
    }, 5 * 60 * 1000); // 5 minutes in milliseconds
    
    return () => clearInterval(refreshInterval);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };

const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <ApperIcon name="Crown" size={20} className="text-accent-500" />;
      case 2:
        return <ApperIcon name="Medal" size={20} className="text-primary-400" />;
      case 3:
        return <ApperIcon name="Award" size={20} className="text-primary-300" />;
      default:
        return <span className="text-gray-500 font-bold">#{rank}</span>;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "from-accent-100 to-accent-200";
      case 2:
        return "from-primary-100 to-primary-200";
      case 3:
        return "from-primary-50 to-primary-100";
      default:
        return "from-gray-50 to-gray-100";
    }
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadSalesReps} />;

return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-1">Track and celebrate your top performers</p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
        <Button
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="flex items-center gap-2"
        >
          <ApperIcon 
            name="RefreshCw" 
            size={16} 
            className={refreshing ? "animate-spin" : ""} 
          />
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {salesReps.length === 0 ? (
        <Empty
          title="No sales reps found"
          description="Add sales representatives to see the leaderboard"
          actionText="Add Rep"
          icon="Trophy"
        />
      ) : (
        <div className="space-y-6">
          {/* Hunter of the Month */}
          {salesReps.length > 0 && (
<Card className="p-6 bg-gradient-to-r from-primary-100 to-primary-200 border-primary-300 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
<div className="relative">
                    <Avatar name={salesReps[0].Name} size="xl" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="Crown" size={16} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Hunter of the Month</h2>
                    <p className="text-xl font-semibold text-primary-700">{salesReps[0].Name}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm text-gray-600">
                        {salesReps[0].deals_closed_c} deals closed
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatCurrency(salesReps[0].total_revenue_c)} revenue
                      </span>
                    </div>
                  </div>
                </div>
<div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    {salesReps[0].deals_closed_c * 3 + salesReps[0].meetings_booked_c * 2 + salesReps[0].leads_contacted_c}
                  </div>
                  <div className="text-sm text-gray-600">Performance Score</div>
                </div>
              </div>
            </Card>
          )}

          {/* Leaderboard Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900">Rank</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900">Sales Rep</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900">Leads Contacted</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900">Meetings Booked</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900">Deals Closed</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900">Revenue</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-900">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
{salesReps.map((rep, index) => {
                    const rank = index + 1;
                    const score = rep.deals_closed_c * 3 + rep.meetings_booked_c * 2 + rep.leads_contacted_c;
                    return (
                      <motion.tr
                        key={rep.Id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`hover:bg-gray-50 transition-colors ${
                          rank <= 3 ? "bg-gradient-to-r " + getRankColor(rank) + " bg-opacity-10" : ""
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {getRankIcon(rank)}
                          </div>
                        </td>
<td className="py-4 px-6">
                          <div className="flex items-center">
                            <Avatar name={rep.Name} size="sm" />
                            <div className="ml-3">
<div className="font-semibold text-gray-900">{rep.Name}</div>
                              {rank === 1 && (
                                <Badge variant="primary" size="sm">
                                  <ApperIcon name="Crown" size={12} className="mr-1" />
                                  Hunter of the Month
                                </Badge>
                              )}
                            </div>
                          </div>
                        </td>
<td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{rep.leads_contacted_c}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{rep.meetings_booked_c}</div>
                        </td>
<td className="py-4 px-6">
                          <div className="font-medium text-primary-600">{rep.deals_closed_c}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900">{formatCurrency(rep.total_revenue_c)}</div>
                        </td>
<td className="py-4 px-6">
                          <div className="font-bold text-accent-600">{score}</div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<Card className="p-6 text-center hover:bg-gray-50 transition-colors duration-200">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Users" size={24} className="text-primary-600" />
              </div>
<h3 className="text-lg font-semibold text-gray-900 mb-2">Total Leads</h3>
              <p className="text-3xl font-bold text-primary-600">
                {salesReps.reduce((sum, rep) => sum + rep.leads_contacted_c, 0)}
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Calendar" size={24} className="text-primary-700" />
              </div>
<h3 className="text-lg font-semibold text-gray-900 mb-2">Total Meetings</h3>
              <p className="text-3xl font-bold text-primary-700">
                {salesReps.reduce((sum, rep) => sum + rep.meetings_booked_c, 0)}
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="DollarSign" size={24} className="text-accent-600" />
              </div>
<h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-accent-600">
                {formatCurrency(salesReps.reduce((sum, rep) => sum + rep.total_revenue_c, 0))}
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;