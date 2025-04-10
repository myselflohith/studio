'use client';

import {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Label} from "@/components/ui/label";
import {useToast} from "@/hooks/use-toast";

export default function UserManagementPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [pricingTier, setPricingTier] = useState('');
  const [wabaId, setWabaId] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const {toast} = useToast();

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
    </div>
  );
}
