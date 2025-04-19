
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface User {
  id: string;
  name: string;
  isActive: boolean;
  email: string;
  wabaId: string;
  phoneNumberId: string;
}

interface Transaction {
  payment_id: number;
  user_id: number;
  payment_method: string;
  payment_date: string;
  transaction_type: 'credit' | 'debit' | 'refund';
  amount: string;
  campaign_id: number;
}

const formatINR = (value: string | number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value));

export default function AddBalancePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentTotals, setPaymentTotals] = useState({ credit: '0', debit: '0', refund: '0' });
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [balanceToAdd, setBalanceToAdd] = useState('');
  const [availableBalance, setAvailableBalance] = useState<string>('0');
  const [message, setMessage] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_USERS_API as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
          body: JSON.stringify({ page: 1, limit: 100 }),
        });

        const json = await response.json();
        const mappedUsers: User[] = json.data.map((user: any) => ({
          id: user.id.toString(),
          name: user.name,
          isActive: user.status === 1,
          email: user.email,
          wabaId: user.waba_id?.toString() || '',
          phoneNumberId: user.phone_number_id?.toString() || '',
        }));

        setUsers(mappedUsers);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch user data.",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUserId) return;

    const fetchTransactions = async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_PAYMENTS_API as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            user_id: selectedUserId,
            page: 1,
            limit: 100,
          }),
        });

        const data = await response.json();
        setTransactions(data.data || []);
        setPaymentTotals(data.totals || { credit: '0', debit: '0', refund: '0' });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch transactions.",
          variant: "destructive",
        });
      }
    };

    const fetchAvailableBalance = async () => {
      try {
        const res = await fetch('https://dev-portal.whatsappalerts.com:3007/api/v1/user/balance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            user_id: parseInt(selectedUserId),
          }),
        });

        const result = await res.json();
        setAvailableBalance(result.balance?.toString() || '0');
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch available balance.",
          variant: "destructive",
        });
      }
    };

    fetchTransactions();
    fetchAvailableBalance();
  }, [selectedUserId]);

  const handleAddBalance = async () => {
    if (!selectedUserId || !balanceToAdd) {
      toast({
        title: "Error",
        description: "Please enter User ID and Balance.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('https://dev-portal.whatsappalerts.com:3007/api/v1/user/add-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          user_id: parseInt(selectedUserId),
          amount: parseFloat(balanceToAdd),
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Failed to add balance');

      toast({
        title: "Success",
        description: `Successfully added ₹${balanceToAdd} to user ${selectedUserId}`,
      });

      setMessage(`Successfully added ₹${balanceToAdd} to user ${selectedUserId}`);
      setBalanceToAdd('');
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add balance.",
        variant: "destructive",
      });
    }
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  const chartData = transactions.map(t => ({
    date: new Date(t.payment_date).toISOString().split('T')[0],
    credit: t.transaction_type === 'credit' ? parseFloat(t.amount) : 0,
    debit: t.transaction_type === 'debit' ? parseFloat(t.amount) : 0,
    refund: t.transaction_type === 'refund' ? parseFloat(t.amount) : 0,
    available: 0
  }));

  return (
    <div className="container mx-auto py-10 grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Balance to User</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Label htmlFor="userId">User ID:</Label>
          <Select onValueChange={handleUserSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a User ID" />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.id} - {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label htmlFor="balance">Balance to Add:</Label>
          <Input
            type="number"
            id="balance"
            value={balanceToAdd}
            onChange={e => setBalanceToAdd(e.target.value)}
            placeholder="Enter Balance"
          />

          <Button onClick={handleAddBalance}>Add Balance</Button>

          {message && <p className="text-sm text-green-500">{message}</p>}
        </CardContent>
      </Card>

      {selectedUserId && (
        <Card>
          <CardHeader>
            <CardTitle>Transaction History for User ID: {selectedUserId}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p>Total Credit: {formatINR(paymentTotals.credit)}</p>
              <p>Total Debit: {formatINR(paymentTotals.debit)}</p>
              <p>Total Refund: {formatINR(paymentTotals.refund)}</p>
              <p><strong>Available Balance: {formatINR(availableBalance)}</strong></p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="credit" stroke="#82ca9d" />
                <Line type="monotone" dataKey="debit" stroke="#8884d8" />
                <Line type="monotone" dataKey="refund" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(t => (
                  <TableRow key={t.payment_id}>
                    <TableCell>{t.transaction_type}</TableCell>
                    <TableCell>{formatINR(t.amount)}</TableCell>
                    <TableCell>{new Date(t.payment_date).toLocaleDateString()}</TableCell>
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
