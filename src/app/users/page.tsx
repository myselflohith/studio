'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  PRICING_API,
  EMBEDDED_USERS_API,
  INSERT_USER_API,
} from '@/lib/api-endpoints';
import { getCookie } from 'cookies-next';

interface PricingOption {
  pricing_id: number;
  marketing: string;
  utility: string;
  authentication: string;
}

interface EmbeddedUser {
  id: number;
  waba_id: string;
  number_id: string;
  phone_number: string;
}

export default function UserManagementPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [pricingTier, setPricingTier] = useState('');
  const [wabaId, setWabaId] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>([]);
  const [embeddedUsers, setEmbeddedUsers] = useState<EmbeddedUser[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const token = getCookie('token');
        const res = await fetch(PRICING_API as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({})
        });
        const data = await res.json();
        setPricingOptions(data.data || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch pricing options.",
          variant: "destructive",
        });
      }
    };

    const fetchEmbeddedUsers = async () => {
      try {
        const token = getCookie('token');
        const res = await fetch(EMBEDDED_USERS_API as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({})
        });
        const data = await res.json();
        setEmbeddedUsers(data.data || []);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch embedded users.",
          variant: "destructive",
        });
      }
    };

    fetchPricing();
    fetchEmbeddedUsers();
  }, []);

  const handlePhoneSelect = (id: string) => {
    const selected = embeddedUsers.find(u => u.id.toString() === id);
    if (selected) {
      setWabaId(selected.waba_id);
      setPhoneNumberId(selected.number_id);
    }
  };

  const handleSubmit = async () => {
    if (!email || !password || !name || !pricingTier || !wabaId || !phoneNumberId) {
      setMessage('Please fill in all fields.');
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = getCookie('token');
      const res = await fetch(INSERT_USER_API as string, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          password,
          name,
          wa_pricing: parseInt(pricingTier),
          balance: 0,
          waba_id: wabaId,
          phone_number_id: phoneNumberId,
          status: 1,
          role: 'user'
        }),
      });

      if (!res.ok) throw new Error('Failed to create user');
      const result = await res.json();

      setMessage('User created successfully!');
      toast({
        title: "User Created",
        description: "User created successfully!",
      });

      setEmail('');
      setPassword('');
      setName('');
      setPricingTier('');
      setWabaId('');
      setPhoneNumberId('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10 grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Label>Email:</Label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" />

          <Label>Password:</Label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />

          <Label>Name:</Label>
          <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter name" />

          <Label>Pricing Tier:</Label>
          <Select onValueChange={setPricingTier}>
            <SelectTrigger>
              <SelectValue placeholder="Select pricing tier" />
            </SelectTrigger>
            <SelectContent>
              {pricingOptions.map(p => (
                <SelectItem key={p.pricing_id} value={p.pricing_id.toString()}>
                  ID {p.pricing_id} — Marketing: ₹{p.marketing}, Utility: ₹{p.utility}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>Select Phone Number:</Label>
          <Select onValueChange={handlePhoneSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose number to auto-fill WABA & Phone ID" />
            </SelectTrigger>
            <SelectContent>
              {embeddedUsers.map(e => (
                <SelectItem key={e.id} value={e.id.toString()}>
                  {e.phone_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label>WABA ID:</Label>
          <Input type="text" value={wabaId} onChange={e => setWabaId(e.target.value)} placeholder="WABA ID" readOnly />

          <Label>Phone Number ID:</Label>
          <Input type="text" value={phoneNumberId} onChange={e => setPhoneNumberId(e.target.value)} placeholder="Phone Number ID" readOnly />

          <Button onClick={handleSubmit}>Create User</Button>

          {message && <p className="text-sm text-green-500">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
