'use client';

import {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Label} from "@/components/ui/label";
import {useToast} from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  isActive: boolean;
}

const mockUsers: User[] = [
  {id: '1', name: 'John Doe', isActive: true},
  {id: '2', name: 'Jane Smith', isActive: false},
  {id: '3', name: 'Alice Johnson', isActive: true},
];

export default function AddBalancePage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [balanceToAdd, setBalanceToAdd] = useState('');

  const {toast} = useToast();

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
  };

  return (
    <div className="container mx-auto py-10 grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Balance to User</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Label htmlFor="userId">User ID:</Label>
          <Select onValueChange={value => setSelectedUserId(value)}>
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
    </div>
  );
}
