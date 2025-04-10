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