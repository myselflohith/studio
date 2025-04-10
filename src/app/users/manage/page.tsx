'use client';

import {useState} from 'react';
import {Switch} from '@/components/ui/switch';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useToast} from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface User {
  id: string;
  name: string;
  isActive: boolean;
  email: string;
  wabaId: string;
  phoneNumberId: string;
}

interface Campaign {
  id: string;
  date: string;
  templateName: string;
  read: number;
  sent: number;
  delivered: number;
  failed: number;
  pending: number;
  status: string;
}

const mockUsers: User[] = [
  {id: '1', name: 'John Doe', isActive: true, email: 'john.doe@example.com', wabaId: 'waba123', phoneNumberId: 'phone123'},
  {id: '2', name: 'Jane Smith', isActive: false, email: 'jane.smith@example.com', wabaId: 'waba456', phoneNumberId: 'phone456'},
  {id: '3', name: 'Alice Johnson', isActive: true, email: 'alice.johnson@example.com', wabaId: 'waba789', phoneNumberId: 'phone789'},
];

const mockCampaigns: Campaign[] = [
  {id: 'campaign1', date: '2024-07-20', templateName: 'Template A', read: 100, sent: 200, delivered: 180, failed: 5, pending: 15, status: 'Completed'},
  {id: 'campaign2', date: '2024-07-21', templateName: 'Template B', read: 150, sent: 250, delivered: 220, failed: 10, pending: 20, status: 'In Progress'},
  {id: 'campaign3', date: '2024-07-22', templateName: 'Template C', read: 120, sent: 220, delivered: 200, failed: 2, pending: 18, status: 'Completed'},
];

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [message, setMessage] = useState<string | null>(null);
  const {toast} = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleToggleActive = (userId: string, checked: boolean) => {
    setUsers(
      users.map(user => {
        if (user.id === userId) {
          return {...user, isActive: checked};
        }
        return user;
      })
    );
    setMessage(`User ${userId} is now ${checked ? 'active' : 'inactive'}`);

    toast({
      title: "User Status Updated",
      description: `User ${userId} is now ${checked ? 'active' : 'inactive'}`,
    });
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };

  const userCampaigns = selectedUser ? mockCampaigns : [];

  return (
    <div className="container mx-auto py-10 grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>WABA ID</TableHead>
                <TableHead>Phone Number ID</TableHead>
                <TableHead>Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id} onClick={() => handleUserClick(user)} className="cursor-pointer">
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.wabaId}</TableCell>
                  <TableCell>{user.phoneNumberId}</TableCell>
                  <TableCell>
                    <Switch
                      id={`active-${user.id}`}
                      checked={user.isActive}
                      onCheckedChange={checked => handleToggleActive(user.id, checked)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {message && <p className="text-sm text-green-500">{message}</p>}
        </CardContent>
      </Card>

      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>Campaigns for {selectedUser.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Read</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Delivered</TableHead>
                  <TableHead>Failed</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userCampaigns.map(campaign => (
                  <TableRow key={campaign.id}>
                    <TableCell>{campaign.id}</TableCell>
                    <TableCell>{campaign.date}</TableCell>
                    <TableCell>{campaign.templateName}</TableCell>
                    <TableCell>{campaign.read}</TableCell>
                    <TableCell>{campaign.sent}</TableCell>
                    <TableCell>{campaign.delivered}</TableCell>
                    <TableCell>{campaign.failed}</TableCell>
                    <TableCell>{campaign.pending}</TableCell>
                    <TableCell>{campaign.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
