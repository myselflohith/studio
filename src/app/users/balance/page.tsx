'use client';

import {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Label} from "@/components/ui/label";
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
}

interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'refund';
  amount: number;
  date: string;
  userId: string; // Add userId to Transaction interface
}

const mockUsers: User[] = [
  {id: '1', name: 'John Doe', isActive: true},
  {id: '2', name: 'Jane Smith', isActive: false},
  {id: '3', name: 'Alice Johnson', isActive: true},
];

const mockTransactions: Transaction[] = [
  {id: '1', type: 'credit', amount: 100, date: '2024-01-01', userId: '1'},
  {id: '2', type: 'debit', amount: 50, date: '2024-01-05', userId: '1'},
  {id: '3', type: 'refund', amount: 20, date: '2024-01-10', userId: '1'},
  {id: '4', type: 'credit', amount: 150, date: '2024-01-15', userId: '2'},
  {id: '5', type: 'debit', amount: 30, date: '2024-01-20', userId: '2'},
  {id: '6', type: 'credit', amount: 200, date: '2024-01-25', userId: '3'},
];

export default function AddBalancePage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [balanceToAdd, setBalanceToAdd] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalRefund, setTotalRefund] = useState(0);
  const [availableBalance, setAvailableBalance] = useState(0);

  const {toast} = useToast();

  useEffect(() => {
    if (selectedUserId) {
      const userTransactions = mockTransactions.filter(transaction => transaction.userId === selectedUserId);
      setTransactions(userTransactions);

      // Calculate totals
      const credit = userTransactions
        .filter(transaction => transaction.type === 'credit')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      setTotalCredit(credit);

      const debit = userTransactions
        .filter(transaction => transaction.type === 'debit')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      setTotalDebit(debit);

      const refund = userTransactions
        .filter(transaction => transaction.type === 'refund')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      setTotalRefund(refund);

      setAvailableBalance(credit - debit + refund);

    } else {
      setTransactions([]);
      setTotalCredit(0);
      setTotalDebit(0);
      setTotalRefund(0);
      setAvailableBalance(0);
    }
  }, [selectedUserId]);



  const handleAddBalance = () => {
    if (!selectedUserId || !balanceToAdd) {
      setMessage('Please enter User ID and Balance.');
      toast({
        title: "Error",
        description: "Please enter User ID and Balance.",
        variant: "destructive",
      });
      return;
    }

    // Simulate adding balance to user
    console.log(`Adding $${balanceToAdd} to user ${selectedUserId}`);
    setMessage(`Successfully added $${balanceToAdd} to user ${selectedUserId}`);

    toast({
      title: "Balance Added",
      description: `Successfully added $${balanceToAdd} to user ${selectedUserId}`,
    });

    // Clear the input fields
    setSelectedUserId(undefined);
    setBalanceToAdd('');
    setTransactions([]); // Clear transactions after adding balance
    setTotalCredit(0);
    setTotalDebit(0);
    setTotalRefund(0);
    setAvailableBalance(0);
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  const chartData = transactions.map(transaction => ({
    date: transaction.date,
    credit: transaction.type === 'credit' ? transaction.amount : 0,
    debit: transaction.type === 'debit' ? transaction.amount : 0,
    refund: transaction.type === 'refund' ? transaction.amount : 0,
    available: transactions.filter(t => t.date <= transaction.date).reduce((acc, t) => {
      if (t.type === 'credit') return acc + t.amount;
      if (t.type === 'debit') return acc - t.amount;
      if (t.type === 'refund') return acc + t.amount;
      return acc;
    }, 0)
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
              <p>Total Credit: ${totalCredit}</p>
              <p>Total Debit: ${totalDebit}</p>
              <p>Total Refund: ${totalRefund}</p>
              <p>Available Balance: ${availableBalance}</p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="credit" stroke="#82ca9d" />
                <Line type="monotone" dataKey="debit" stroke="#8884d8" />
                <Line type="monotone" dataKey="refund" stroke="#ffc658" />
                <Line type="monotone" dataKey="available" stroke="#007BFF" />
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
                {transactions.length > 0 ? (
                  transactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3}>No transactions found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
