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
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

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

interface Payment {
  id: string;
  method: string;
  type: 'credit' | 'debit' | 'refund';
  amount: number;
  campaignId: string;
  date: string;
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

const mockPayments: Payment[] = [
  {id: 'payment1', method: 'Credit Card', type: 'credit', amount: 50, campaignId: 'campaign1', date: '2024-07-20'},
  {id: 'payment2', method: 'PayPal', type: 'debit', amount: 30, campaignId: 'campaign2', date: '2024-07-21'},
  {id: 'payment3', method: 'Credit Card', type: 'refund', amount: 20, campaignId: 'campaign3', date: '2024-07-22'},
];

const mockSearchResults = [
  {campaignId: '123', templateName: 'Promo', status: 'Sent', sentAt: '2024-08-01 10:00', updatedAt: '2024-08-01 10:05'},
  {campaignId: '456', templateName: 'Update', status: 'Delivered', sentAt: '2024-08-02 14:00', updatedAt: '2024-08-02 14:10'},
];

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [message, setMessage] = useState<string | null>(null);
  const {toast} = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchResults, setSearchResults] = useState(mockSearchResults);

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
  const userPayments = selectedUser ? mockPayments.filter(payment => userCampaigns.some(campaign => campaign.id === payment.campaignId)) : [];

  const handleSearch = () => {
    // Implement search logic here
    console.log(`Searching for phone number: ${phoneNumber}`);
    // setSearchResults([{campaignId: '123', templateName: 'Template', status: 'Delivered', sentAt: '2024-01-01', updatedAt: '2024-01-01'}])
    // In a real application, you would fetch data from an API here
  };

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
        <>
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

          <Card>
            <CardHeader>
              <CardTitle>Payments for {selectedUser.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Campaign ID</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userPayments.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{payment.type}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>{payment.campaignId}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Search Campaigns by Phone Number</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Input
            type="text"
            placeholder="Enter Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Button onClick={handleSearch}>Search</Button>

          {searchResults.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign ID</TableHead>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Chat Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((result) => (
                  <TableRow key={result.campaignId}>
                    <TableCell>{result.campaignId}</TableCell>
                    <TableCell>{result.templateName}</TableCell>
                    <TableCell>{result.status}</TableCell>
                    <TableCell>{result.sentAt}</TableCell>
                    <TableCell>{result.updatedAt}</TableCell>
                    <TableCell>
                      <Button>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
