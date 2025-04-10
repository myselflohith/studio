'use client';

import {useState} from 'react';
import {Switch} from '@/components/ui/switch';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
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

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [message, setMessage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [pricingTier, setPricingTier] = useState('');
  const [wabaId, setWabaId] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);
  const [balanceToAdd, setBalanceToAdd] = useState('');

  const {toast} = useToast();

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

  const handleSubmit = () => {
    if (!email || !password || !name || !pricingTier || !wabaId || !phoneNumberId) {
      setMessage('Please fill in all fields.');
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    console.log('Form submitted:', {
      email,
      password,
      name,
      pricingTier,
      wabaId,
      phoneNumberId,
    });
    setMessage('User created successfully!');

    toast({
      title: "User Created",
      description: "User created successfully!",
    });

    // Clear the form fields
    setEmail('');
    setPassword('');
    setName('');
    setPricingTier('');
    setWabaId('');
    setPhoneNumberId('');
  };

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
          <CardTitle>Create New User</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Label htmlFor="email">Email:</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter email"
          />

          <Label htmlFor="password">Password:</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
          />

          <Label htmlFor="name">Name:</Label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter name"
          />

          <Label htmlFor="pricingTier">Pricing Tier:</Label>
          <Select onValueChange={setPricingTier}>
            <SelectTrigger>
              <SelectValue placeholder="Select a pricing tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>

          <Label htmlFor="wabaId">WABA ID:</Label>
          <Input
            type="text"
            id="wabaId"
            value={wabaId}
            onChange={e => setWabaId(e.target.value)}
            placeholder="Enter WABA ID"
          />

          <Label htmlFor="phoneNumberId">Phone Number ID:</Label>
          <Input
            type="text"
            id="phoneNumberId"
            value={phoneNumberId}
            onChange={e => setPhoneNumberId(e.target.value)}
            placeholder="Enter Phone Number ID"
          />

          <Button onClick={handleSubmit}>Create User</Button>

          {message && <p className="text-sm text-green-500">{message}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between space-x-4 py-2">
              <div>{user.name} (ID: {user.id})</div>
              <div className="flex items-center space-x-2">
                <Label htmlFor={`active-${user.id}`}>Active:</Label>
                <Switch
                  id={`active-${user.id}`}
                  checked={user.isActive}
                  onCheckedChange={checked => handleToggleActive(user.id, checked)}
                />
              </div>
            </div>
          ))}
          {message && <p className="text-sm text-green-500">{message}</p>}
        </CardContent>
      </Card>

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
