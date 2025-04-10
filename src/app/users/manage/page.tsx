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
import { Icons } from "@/components/icons";

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
  {id: 'campaign4', date: '2024-07-23', templateName: 'Template D', read: 130, sent: 230, delivered: 210, failed: 7, pending: 13, status: 'Completed'},
  {id: 'campaign5', date: '2024-07-24', templateName: 'Template E', read: 140, sent: 240, delivered: 225, failed: 3, pending: 12, status: 'In Progress'},
  {id: 'campaign6', date: '2024-07-25', templateName: 'Template F', read: 110, sent: 210, delivered: 190, failed: 6, pending: 14, status: 'Completed'},
  {id: 'campaign7', date: '2024-07-26', templateName: 'Template G', read: 160, sent: 260, delivered: 240, failed: 9, pending: 11, status: 'In Progress'},
  {id: 'campaign8', date: '2024-07-27', templateName: 'Template H', read: 125, sent: 235, delivered: 205, failed: 4, pending: 16, status: 'Completed'},
  {id: 'campaign9', date: '2024-07-28', templateName: 'Template I', read: 135, sent: 245, delivered: 215, failed: 8, pending: 17, status: 'In Progress'},
  {id: 'campaign10', date: '2024-07-29', templateName: 'Template J', read: 145, sent: 255, delivered: 230, failed: 1, pending: 24, status: 'Completed'},
];

const mockPayments: Payment[] = [
  {id: 'payment1', method: 'Credit Card', type: 'credit', amount: 50, campaignId: 'campaign1', date: '2024-07-20'},
  {id: 'payment2', method: 'PayPal', type: 'debit', amount: 30, campaignId: 'campaign2', date: '2024-07-21'},
  {id: 'payment3', method: 'Credit Card', type: 'refund', amount: 20, campaignId: 'campaign3', date: '2024-07-22'},
  {id: 'payment4', method: 'Credit Card', type: 'credit', amount: 60, campaignId: 'campaign4', date: '2024-07-23'},
  {id: 'payment5', method: 'PayPal', type: 'debit', amount: 40, campaignId: 'campaign5', date: '2024-07-24'},
  {id: 'payment6', method: 'Credit Card', type: 'refund', amount: 15, campaignId: 'campaign6', date: '2024-07-25'},
  {id: 'payment7', method: 'Credit Card', type: 'credit', amount: 55, campaignId: 'campaign7', date: '2024-07-26'},
  {id: 'payment8', method: 'PayPal', type: 'debit', amount: 25, campaignId: 'campaign8', date: '2024-07-27'},
  {id: 'payment9', method: 'Credit Card', type: 'refund', amount: 10, campaignId: 'campaign9', date: '2024-07-28'},
  {id: 'payment10', method: 'Credit Card', type: 'credit', amount: 70, campaignId: 'campaign10', date: '2024-07-29'},
];

const mockSearchResults = [
  {campaignId: '123', templateName: 'Promo', status: 'Sent', sentAt: '2024-08-01 10:00', updatedAt: '2024-08-01 10:05'},
  {campaignId: '456', templateName: 'Update', status: 'Delivered', sentAt: '2024-08-02 14:00', updatedAt: '2024-08-02 14:10'},
];

const ITEMS_PER_PAGE = 5;

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [message, setMessage] = useState<string | null>(null);
  const {toast} = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchResults, setSearchResults] = useState(mockSearchResults);

  // Pagination state for campaigns
  const [campaignCurrentPage, setCampaignCurrentPage] = useState(1);
  // Pagination state for payments
  const [paymentCurrentPage, setPaymentCurrentPage] = useState(1);
    // Pagination state for search results
  const [searchCurrentPage, setSearchCurrentPage] = useState(1);

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
    setCampaignCurrentPage(1); // Reset campaign pagination
    setPaymentCurrentPage(1); // Reset payment pagination
    setSearchCurrentPage(1); // Reset search pagination
  };

  const userCampaigns = selectedUser ? mockCampaigns : [];
  const userPayments = selectedUser ? mockPayments.filter(payment => userCampaigns.some(campaign => campaign.id === payment.campaignId)) : [];

  const handleSearch = () => {
    // Implement search logic here
    console.log(`Searching for phone number: ${phoneNumber}`);
    // setSearchResults([{campaignId: '123', templateName: 'Template', status: 'Delivered', sentAt: '2024-01-01', updatedAt: '2024-01-01'}])
    // In a real application, you would fetch data from an API here
    setSearchCurrentPage(1); // Reset search pagination
  };

    // Pagination calculation for campaigns
  const campaignStartIndex = (campaignCurrentPage - 1) * ITEMS_PER_PAGE;
  const campaignEndIndex = campaignStartIndex + ITEMS_PER_PAGE;
  const paginatedCampaigns = userCampaigns.slice(campaignStartIndex, campaignEndIndex);

  // Pagination calculation for payments
  const paymentStartIndex = (paymentCurrentPage - 1) * ITEMS_PER_PAGE;
  const paymentEndIndex = paymentStartIndex + ITEMS_PER_PAGE;
  const paginatedPayments = userPayments.slice(paymentStartIndex, paymentEndIndex);

    // Pagination calculation for search results
    const searchStartIndex = (searchCurrentPage - 1) * ITEMS_PER_PAGE;
    const searchEndIndex = searchStartIndex + ITEMS_PER_PAGE;
    const paginatedSearchResults = searchResults.slice(searchStartIndex, searchEndIndex);

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
                  {paginatedCampaigns.map(campaign => (
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
              <div className="flex justify-between items-center mt-2">
                  <Button
                      onClick={() => setCampaignCurrentPage(campaignCurrentPage - 1)}
                      disabled={campaignCurrentPage === 1}
                      variant="outline"
                      size="sm"
                  >
                      <Icons.chevronDown className="h-4 w-4 rotate-270" />
                      Previous
                  </Button>
                  <span>Page {campaignCurrentPage} of {Math.ceil(userCampaigns.length / ITEMS_PER_PAGE)}</span>
                  <Button
                      onClick={() => setCampaignCurrentPage(campaignCurrentPage + 1)}
                      disabled={campaignEndIndex >= userCampaigns.length}
                      variant="outline"
                      size="sm"
                  >
                      Next
                      <Icons.chevronDown className="h-4 w-4 rotate-90" />
                  </Button>
              </div>
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
                  {paginatedPayments.map(payment => (
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
              <div className="flex justify-between items-center mt-2">
                  <Button
                      onClick={() => setPaymentCurrentPage(paymentCurrentPage - 1)}
                      disabled={paymentCurrentPage === 1}
                      variant="outline"
                      size="sm"
                  >
                      <Icons.chevronDown className="h-4 w-4 rotate-270" />
                      Previous
                  </Button>
                  <span>Page {paymentCurrentPage} of {Math.ceil(userPayments.length / ITEMS_PER_PAGE)}</span>
                  <Button
                      onClick={() => setPaymentCurrentPage(paymentCurrentPage + 1)}
                      disabled={paymentEndIndex >= userPayments.length}
                      variant="outline"
                      size="sm"
                  >
                      Next
                      <Icons.chevronDown className="h-4 w-4 rotate-90" />
                  </Button>
              </div>
            </CardContent>
          </Card>

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
                    {paginatedSearchResults.map((result) => (
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
               <div className="flex justify-between items-center mt-2">
                      <Button
                          onClick={() => setSearchCurrentPage(searchCurrentPage - 1)}
                          disabled={searchCurrentPage === 1}
                          variant="outline"
                          size="sm"
                      >
                          <Icons.chevronDown className="h-4 w-4 rotate-270" />
                          Previous
                      </Button>
                      <span>Page {searchCurrentPage} of {Math.ceil(searchResults.length / ITEMS_PER_PAGE)}</span>
                      <Button
                          onClick={() => setSearchCurrentPage(searchCurrentPage + 1)}
                          disabled={searchEndIndex >= searchResults.length}
                          variant="outline"
                          size="sm"
                      >
                          Next
                          <Icons.chevronDown className="h-4 w-4 rotate-90" />
                      </Button>
                  </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
