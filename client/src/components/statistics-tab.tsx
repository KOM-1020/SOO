import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Clock, Route, CheckCircle, Building, Calendar, CalendarCheck, Cog, X, TrendingDown, BarChart3 } from "lucide-react";
import { useState } from 'react';
import TravelTimeChart from "@/components/charts/travel-time-chart";
import TimeShiftChart from "@/components/charts/time-shift-chart";
import DailySlotsChart from "@/components/charts/daily-slots-chart";
import { TravelTimeComparisonChart } from "./travel-time-comparison-chart";
import { EnhancedTravelTimeChart } from "./enhanced-travel-time-chart";

interface StatisticsTabProps {
  stats: {
    totalCustomers: number;
    totalTravelTimeSaved: number;
    totalOriginalTravelTime: number;
    totalOptimizedTravelTime: number;
    totalPercentImprovement: number;
    avgOriginalTravelTime: number;
    avgOptimizedTravelTime: number;
    medianOriginal: number;
    medianOptimized: number;
    avgTravelReduction: number;
    dailyStats: Array<{
      day: string;
      optimizedTravelTime: number;
      originalTravelTime: number;
      optimizedSlots: number;
      originalSlots: number;
      customerCount: number;
      timeSaved: number;
      percentImprovement: number;
    }>;
    timeShiftData: Array<{
      timeShift: number;
      customerCount: number;
    }>;
  };
}

export default function StatisticsTab({ stats }: StatisticsTabProps) {
  // State for chart slicers
  const [metricType, setMetricType] = useState<'total' | 'average' | 'median'>('total');
  const [viewType, setViewType] = useState<'day' | 'team'>('day');

  // Helper function to format time
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round((minutes % 60) * 100) / 100;
    return hours > 0 ? `${hours}h ${Math.round(mins)}m` : `${mins.toFixed(2)}m`;
  };

  // Helper function to format time in hours only
  const formatTimeInHours = (minutes: number) => {
    return `${(minutes / 60).toFixed(2)} hours`;
  };

  // Helper function to format numbers with 2 decimal places
  const formatNumber = (num: number) => {
    return num.toFixed(2);
  };

  // Helper function to capitalize day names
  const capitalizeDay = (day: string) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  // Generate dynamic title for the chart
  const getChartTitle = () => {
    const viewDisplay = viewType === 'day' ? 'day' : 'team';
    return `How does the travel time between cleans differ by ${viewDisplay}?`;
  };

  return (
    <div className="space-y-4 transform scale-100 origin-top-left w-full overflow-hidden">
      {/* Side-by-side layout for Overall Comparison and Day-by-Day Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Overall Comparison Statistics */}
        <Card style={{ height: '350px' }}>
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: '#00365b' }}>
              Does the optimizer reduce the travel time?
            </CardTitle>
          </CardHeader>
          <CardContent style={{ height: '280px', padding: '4px 16px', overflow: 'hidden' }}>
            <div className="space-y-3">
              <div className="border-b pb-3">
                <h4 className="text-gray-900 mb-2">Total Travel Time</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-gray-600">Original</span>
                    <div className="font-semibold">
                      {formatTimeInHours(stats.totalOriginalTravelTime)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Optimized</span>
                    <div className="font-semibold">
                      {formatTimeInHours(stats.totalOptimizedTravelTime)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Time Saved</span>
                    <div className="font-semibold text-green-600">
                      {formatTimeInHours(stats.totalTravelTimeSaved)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Improvement</span>
                    <div className="font-semibold text-green-600 text-lg">
                      {formatNumber(stats.totalPercentImprovement)}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b pb-3">
                <h4 className="text-gray-900 mb-2">Average Travel Time</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-600">Original</span>
                    <span className="ml-2 font-semibold">{formatNumber(stats.avgOriginalTravelTime)} min</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Optimized</span>
                    <span className="ml-2 font-semibold">{formatNumber(stats.avgOptimizedTravelTime)} min</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Improvement</span>
                    <span className="ml-2 font-semibold text-red-600">
                      {formatNumber(stats.avgOriginalTravelTime - stats.avgOptimizedTravelTime)} min 
                      ({formatNumber(((stats.avgOriginalTravelTime - stats.avgOptimizedTravelTime) / stats.avgOriginalTravelTime) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-gray-900 mb-2">Median Travel Time</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-gray-600">Original</span>
                    <span className="ml-2 font-semibold">{formatNumber(stats.medianOriginal)} min</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Optimized</span>
                    <span className="ml-2 font-semibold">{formatNumber(stats.medianOptimized)} min</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Improvement</span>
                    <span className="ml-2 font-semibold text-green-600">
                      {formatNumber(stats.medianOriginal - stats.medianOptimized)} min 
                      ({formatNumber(((stats.medianOriginal - stats.medianOptimized) / stats.medianOriginal) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>


            </div>
          </CardContent>
        </Card>

        {/* Enhanced Comparison Bar Chart with Dynamic Slicers */}
        <Card style={{ height: '350px', width: 'calc(50% + 250px)' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg" style={{ color: '#00365b' }}>
              {getChartTitle()}
            </CardTitle>
            <div className="flex justify-center gap-12 mt-2">
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">Metric:</span>
                <Select value={metricType} onValueChange={(value: 'total' | 'average' | 'median') => setMetricType(value)}>
                  <SelectTrigger className="w-24 h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="total">Total</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="median">Median</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600">View:</span>
                <Select value={viewType} onValueChange={(value: 'day' | 'team') => setViewType(value)}>
                  <SelectTrigger className="w-24 h-6 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">By Day</SelectItem>
                    <SelectItem value="team">By Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent style={{ height: '280px', padding: '16px' }}>
            <EnhancedTravelTimeChart 
              metricType={metricType} 
              viewType={viewType} 
              dailyStats={stats.dailyStats} 
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card style={{ height: '279px' }}>
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: '#00365b' }}>
              How does the optimizer shift the date?
            </CardTitle>
          </CardHeader>
          <CardContent style={{ height: '209px', padding: '16px' }}>
            <TimeShiftChart data={stats.timeShiftData} />
          </CardContent>
        </Card>

        <Card style={{ height: '279px', width: 'calc(50% + 250px)' }}>
          <CardHeader>
            <CardTitle className="text-lg" style={{ color: '#00365b' }}>
              How many orders does the franchise finish in total?
            </CardTitle>
          </CardHeader>
          <CardContent style={{ height: '209px', padding: '16px' }}>
            <DailySlotsChart data={stats.dailyStats} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}