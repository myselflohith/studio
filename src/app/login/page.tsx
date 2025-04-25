'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LOGIN_API } from '@/lib/api-endpoints';
import { useToast } from "@/hooks/use-toast";
import Cookies from 'js-cookie';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  try {
    const response = await fetch(LOGIN_API as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Login response:", data); // ✅

    if (response.ok && data.token) {
      Cookies.set('token', data.token, {
        expires: 7,
        sameSite: 'Lax',
      });

      toast({
        title: "Success",
        description: "Login successful!",
      });

      router.push('/');
    } else {
      setError(data.message || 'Invalid credentials');
      toast({
        title: "Error",
        description: data.message || 'Invalid credentials',
        variant: "destructive",
      });
    }
  } catch (err: any) {
    console.error("Login error:", err);
    setError(err.message || 'Something went wrong');
    toast({
      title: "Error",
      description: err.message || 'Something went wrong',
      variant: "destructive",
    });
  }
};
  return (
    <div className="grid h-screen place-items-center">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
