"use client";

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { USERS_API } from '@/lib/api-endpoints';
import { Icons } from "@/components/icons";


interface User {
  id: string;
  name: string;
  isActive: boolean;
  email: string;
  wabaId: string;
  phoneNumberId: string;
}

interface UserManagementContentProps {
  onUserClick: (user: User) => void;
}


const ITEMS_PER_PAGE = 10;

export function UserManagementContent({ onUserClick }: UserManagementContentProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);


  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(USERS_API as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
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

  const handleToggleActive = (userId: string, checked: boolean) => {
    setUsers(
      users.map(user => (user.id === userId ? { ...user, isActive: checked } : user))
    );
    setMessage(`User ${userId} is now ${checked ? 'active' : 'inactive'}`);
    toast({
      title: "User Status Updated",
      description: `User ${userId} is now ${checked ? 'active' : 'inactive'}`,
    });
  };

  return (
    <div>
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
                <TableRow key={user.id} onClick={() => onUserClick(user)} className="cursor-pointer">
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
    </div>
  );
}
