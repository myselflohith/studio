'use client';

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {TemplateDetailsDisplay} from "@/components/TemplateDetailsDisplay";
import {AnalyticsSummary} from "@/components/AnalyticsSummary";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { cookies } from 'next/headers';

export function WabaManagerDashboard() {
  const [activeTab, setActiveTab] = useState("analytics");
   const router = useRouter();

  useEffect(() => {
    const token = cookies().get('token')?.value;
    if (!token) {
      router.push('/login');
    }
  }, [router]);

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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Create User</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link href="/users">
                      <Button>Go to Create User</Button>
                    </Link>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Manage Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link href="/users/manage">
                      <Button>Go to Manage Users</Button>
                    </Link>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Add Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link href="/users/balance">
                      <Button>Go to Add Balance</Button>
                    </Link>
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
