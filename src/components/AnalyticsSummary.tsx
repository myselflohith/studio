"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {summarizeInsights} from "@/ai/flows/summarize-insights";
import {Skeleton} from "@/components/ui/skeleton";

interface AnalyticsData {
  totalSent: number;
  delivered: number;
  read: number;
  failed: number;
  pending: number;
  today: number;
  yesterday: number;
  thisMonth: number;
}

export function AnalyticsSummary() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);

      // Simulate fetching analytics data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockAnalyticsData: AnalyticsData = {
        totalSent: 1500,
        delivered: 1400,
        read: 1200,
        failed: 50,
        pending: 50,
        today: 350,
        yesterday: 300,
        thisMonth: 8000,
      };

      setAnalyticsData(mockAnalyticsData);

      try {
        if (mockAnalyticsData) {
          const insights = await summarizeInsights({
            messageAnalytics: {
              totalSent: mockAnalyticsData.totalSent,
              delivered: mockAnalyticsData.delivered,
              read: mockAnalyticsData.read,
              failed: mockAnalyticsData.failed,
              pending: mockAnalyticsData.pending,
            },
            earningsData: {
              today: mockAnalyticsData.today,
              yesterday: mockAnalyticsData.yesterday,
              thisMonth: mockAnalyticsData.thisMonth,
            },
          });
          setSummary(insights.summary);
        }
      } catch (error) {
        console.error("Failed to summarize insights:", error);
        setSummary("Failed to load summary.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-4 w-[200px]" />
          ) : (
            <p>{summary || "No summary available."}</p>
          )}
          {analyticsData && (
            <div className="mt-4">
              <p>Total Messages Sent: {analyticsData.totalSent}</p>
              <p>Delivered: {analyticsData.delivered}</p>
              <p>Read: {analyticsData.read}</p>
              <p>Failed: {analyticsData.failed}</p>
              <p>Pending: {analyticsData.pending}</p>
              <p>Earnings Today: ${analyticsData.today}</p>
              <p>Earnings Yesterday: ${analyticsData.yesterday}</p>
              <p>Earnings This Month: ${analyticsData.thisMonth}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
