'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  TEMPLATES_API,
  NUMBER_REPORT_API,
  PAYMENTS_API,
  USERS_API,
} from '@/lib/api-endpoints';
import { getCookie } from 'cookies-next';


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
  name: string;
  description: string;
  created_at: string;
  platform: string;
  status: string | null;
  whatsapp_template_name: string | null;
}

interface Payment {
  payment_id: number;
  user_id: number;
  payment_method: string;
  payment_date: string;
  transaction_type: string;
  amount: string;
  campaign_id: number;
}

const ITEMS_PER_PAGE = 10;

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignPage, setCampaignPage] = useState(1);
  const [campaignTotalPages, setCampaignTotalPages] = useState(1);

  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentTotalPages, setPaymentTotalPages] = useState(1);
  const [paymentTotals, setPaymentTotals] = useState({ debit: '0', credit: '0', refund: '0' });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [paginatedSearchResults, setPaginatedSearchResults] = useState<any[]>([]);


  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getCookie('token');
        const response = await fetch(USERS_API as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            page: userPage,
            limit: ITEMS_PER_PAGE,
          }),
        });

        const json = await response.json();

        const mappedUsers: User[] = json.data.map((user: any) => ({
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          isActive: user.status === 1,
          wabaId: user.waba_id?.toString() || '',
          phoneNumberId: user.phone_number_id?.toString() || '',
        }));

        setUsers(mappedUsers);
        setUserTotalPages(json.pagination?.total_pages || 1);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch user data.",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, [userPage]);

  const fetchPhoneSearchResults = async () => {
    if (!selectedUser || !phoneNumber) {
      toast({
        title: "Missing input",
        description: "Please select a user and enter a phone number.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = getCookie('token');
      const response = await fetch(NUMBER_REPORT_API as string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          user_id: selectedUser.id,
        }),
      });

      const data = await response.json();
      const results = data.data || [];

      setSearchResults(results);
      setSearchPage(1);
      setSearchTotalPages(Math.ceil(results.length / ITEMS_PER_PAGE));
      setPaginatedSearchResults(results.slice(0, ITEMS_PER_PAGE));
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch campaign report.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const start = (searchPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setPaginatedSearchResults(searchResults.slice(start, end));
  }, [searchPage, searchResults]);



  const fetchCampaigns = async (userId: string, page = 1) => {
    try {
      const token = getCookie('token');
      const response = await fetch(
        `${TEMPLATES_API}/?page=${page}&limit=10`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
          }),
        }
      );

      const data = await response.json();
      setCampaigns(data.templates || []);
      setCampaignTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
      toast({
        title: "Error",
        description: "Failed to fetch campaign templates.",
        variant: "destructive",
      });
    }
  };


  const fetchPayments = async (userId: string, page = 1) => {
    try {
      const token = getCookie('token');
      const response = await fetch(PAYMENTS_API as string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          page,
          limit: ITEMS_PER_PAGE,
        }),
      });

      const data = await response.json();
      setPayments(data.data || []);
      setPaymentTotalPages(data.pagination?.total_pages || 1);
      setPaymentTotals(data.totals || { debit: '0', credit: '0', refund: '0' });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to fetch payment data.",
        variant: "destructive",
      });
    }
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setCampaignPage(1);
    setPaymentPage(1);
    fetchCampaigns(user.id, 1);
    fetchPayments(user.id, 1);
  };

  const handleToggleActive = (userId: string, checked: boolean) => {
    const token = getCookie('token');
    fetch(USERS_API + `/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: checked ? 1 : 0 }),
    })
      .then(response => response.json())
      .then(data => {
        setUsers(
          users.map(user => (user.id === userId ? { ...user, isActive: checked } : user))
        );
        setMessage(`User ${userId} is now ${checked ? 'active' : 'inactive'}`);
        toast({
          title: "User Status Updated",
          description: `User ${userId} is now ${checked ? 'active' : 'inactive'}`,
        });
      })
      .catch(error => {
        toast({
          title: "Error",
          description: "Failed to update user status.",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="container mx-auto py-10 grid gap-4">
      {/* Users Table */}
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
          {message && <p className="text-sm text-green-500 mt-2">{message}</p>}
          <div className="flex justify-between items-center mt-4">
            <Button onClick={() => setUserPage(p => Math.max(p - 1, 1))} disabled={userPage === 1} variant="outline" size="sm">
              <Icons.chevronDown className="h-4 w-4 rotate-270" />
              Previous
            </Button>
            <span>Page {userPage} of {userTotalPages}</span>
            <Button onClick={() => setUserPage(p => Math.min(p + 1, userTotalPages))} disabled={userPage === userTotalPages} variant="outline" size="sm">
              Next
              <Icons.chevronDown className="h-4 w-4 rotate-90" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Section */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>Campaigns for {selectedUser.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>WhatsApp Template</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.description}</TableCell>
                    <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{c.platform}</TableCell>
                    <TableCell>{c.status || '-'}</TableCell>
                    <TableCell>{c.whatsapp_template_name || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
              <Button onClick={() => { setCampaignPage(p => Math.max(p - 1, 1)); fetchCampaigns(selectedUser.id, campaignPage - 1); }} disabled={campaignPage === 1} variant="outline" size="sm">
                <Icons.chevronDown className="h-4 w-4 rotate-270" />
                Previous
              </Button>
              <span>Page {campaignPage} of {campaignTotalPages}</span>
              <Button onClick={() => { setCampaignPage(p => Math.min(p + 1, campaignTotalPages)); fetchCampaigns(selectedUser.id, campaignPage + 1); }} disabled={campaignPage === campaignTotalPages} variant="outline" size="sm">
                Next
                <Icons.chevronDown className="h-4 w-4 rotate-90" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payments Section */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>Payments for {selectedUser.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-3 text-sm">
              <p>Total Credit: Rs. {paymentTotals.credit}</p>
              <p>Total Debit: Rs. {paymentTotals.debit}</p>
              <p>Total Refund: Rs. {paymentTotals.refund}</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Campaign ID</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map(p => (
                  <TableRow key={p.payment_id}>
                    <TableCell>{p.payment_id}</TableCell>
                    <TableCell>{p.payment_method}</TableCell>
                    <TableCell>{p.transaction_type}</TableCell>
                    <TableCell>Rs. {p.amount}</TableCell>
                    <TableCell>{p.campaign_id}</TableCell>
                    <TableCell>{new Date(p.payment_date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
              <Button onClick={() => { setPaymentPage(p => Math.max(p - 1, 1)); fetchPayments(selectedUser.id, paymentPage - 1); }} disabled={paymentPage === 1} variant="outline" size="sm">
                <Icons.chevronDown className="h-4 w-4 rotate-270" />
                Previous
              </Button>
              <span>Page {paymentPage} of {paymentTotalPages}</span>
              <Button onClick={() => { setPaymentPage(p => Math.min(p + 1, paymentTotalPages)); fetchPayments(selectedUser.id, paymentPage + 1); }} disabled={paymentPage === paymentTotalPages} variant="outline" size="sm">
                Next
                <Icons.chevronDown className="h-4 w-4 rotate-90" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle>Search Campaigns by Phone Number</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <Button onClick={fetchPhoneSearchResults}>Search</Button>
            </div>

            {paginatedSearchResults.length > 0 && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign ID</TableHead>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Sent At</TableHead>
                      <TableHead>Updated At</TableHead>
                      <TableHead>WhatsApp Template</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSearchResults.map((res) => (
                      <TableRow key={res.campaign_id}>
                        <TableCell>{res.campaign_id}</TableCell>
                        <TableCell>{res.template_name}</TableCell>
                        <TableCell>{res.status}</TableCell>
                        <TableCell>{new Date(res.sent_at).toLocaleString()}</TableCell>
                        <TableCell>{new Date(res.updated_at).toLocaleString()}</TableCell>
                        <TableCell>{res.wa_template_name || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-between items-center mt-4">
                  <Button
                    onClick={() => setSearchPage(p => Math.max(p - 1, 1))}
                    disabled={searchPage === 1}
                    variant="outline"
                    size="sm"
                  >
                    <Icons.chevronDown className="h-4 w-4 rotate-270" />
                    Previous
                  </Button>
                  <span>Page {searchPage} of {searchTotalPages}</span>
                  <Button
                    onClick={() => setSearchPage(p => Math.min(p + 1, searchTotalPages))}
                    disabled={searchPage === searchTotalPages}
                    variant="outline"
                    size="sm"
                  >
                    Next
                    <Icons.chevronDown className="h-4 w-4 rotate-90" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

    </div>
  );
}
