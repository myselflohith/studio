"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {UserCreationForm} from "@/components/UserCreationForm";
import {UserManagement} from "@/components/UserManagement";
import {BalanceManagement} from "@/components/BalanceManagement";
import {TemplateDetailsDisplay} from "@/components/TemplateDetailsDisplay";
import {AnalyticsSummary} from "@/components/AnalyticsSummary";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

export function WabaManagerDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");

  useEffect(() => {
    console.log(`Active Tab: ${activeTab}`);
  }, [activeTab]);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">WABA Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="analytics" className="w-full">
            <TabsList>
              <TabsTrigger value="analytics" onClick={() => setActiveTab("analytics")}>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="userManagement" onClick={() => setActiveTab("userManagement")}>
                User Management
              </TabsTrigger>
              <TabsTrigger value="templates" onClick={() => setActiveTab("templates")}>
                Templates
              </TabsTrigger>
            </TabsList>
            <TabsContent value="analytics" className="mt-6">
              <AnalyticsSummary />
            </TabsContent>
            <TabsContent value="userManagement" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New User</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UserCreationForm />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UserManagement />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Balance Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BalanceManagement />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="templates" className="mt-6">
              <TemplateDetailsDisplay />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
]]></content>
  </change>
</changes>
```

```xml
<changes>
  <change>
    <file>src/components/AnalyticsSummary.tsx</file>
    <description>Implements the component to display summarized analytics using AI and graph.</description>
    <content><![CDATA]"use client";

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
]]></content>
  </change>
</changes>
```

```xml
<changes>
  <change>
    <file>src/components/BalanceManagement.tsx</file>
    <description>Creates the Balance Management component to add balance to user accounts.</description>
    <content><![CDATA]"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card} from "@/components/ui/card";

export function BalanceManagement() {
  const [userId, setUserId] = useState("");
  const [balanceToAdd, setBalanceToAdd] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleAddBalance = () => {
    if (!userId || !balanceToAdd) {
      setMessage("Please enter User ID and Balance.");
      return;
    }

    // Simulate adding balance to user
    console.log(`Adding $${balanceToAdd} to user ${userId}`);
    setMessage(`Successfully added $${balanceToAdd} to user ${userId}`);

    // Clear the input fields
    setUserId("");
    setBalanceToAdd("");
  };

  return (
    <Card className="w-full">
      <div className="flex flex-col space-y-4">
        <Label htmlFor="userId">User ID:</Label>
        <Input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
        />

        <Label htmlFor="balance">Balance to Add:</Label>
        <Input
          type="number"
          id="balance"
          value={balanceToAdd}
          onChange={(e) => setBalanceToAdd(e.target.value)}
          placeholder="Enter Balance"
        />

        <Button onClick={handleAddBalance}>Add Balance</Button>

        {message && <p className="text-sm text-green-500">{message}</p>}
      </div>
    </Card>
  );
}
]]></content>
  </change>
</changes>
```

```xml
<changes>
  <change>
    <file>src/components/TemplateDetailsDisplay.tsx</file>
    <description>Creates the Template Details Display component to show template information.</description>
    <content><![CDATA]"use client";

import {useEffect, useState} from "react";
import {getWabaTemplateDetails, WabaTemplate} from "@/services/waba";
import {Skeleton} from "@/components/ui/skeleton";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

export function TemplateDetailsDisplay() {
  const [templateDetails, setTemplateDetails] = useState<WabaTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      setIsLoading(true);
      try {
        const details = await getWabaTemplateDetails("sample_template"); // Replace with actual template ID
        setTemplateDetails(details);
      } catch (error) {
        console.error("Failed to fetch template details:", error);
        setTemplateDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateDetails();
  }, []);

  return (
    <div className="container mx-auto py-4">
      <Table>
        <TableCaption>A list of your waba templates.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>
          ) : templateDetails ? (
            <TableRow>
              <TableCell className="font-medium">{templateDetails.name}</TableCell>
              <TableCell>{templateDetails.category}</TableCell>
              <TableCell>{templateDetails.status}</TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No template details found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}