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

interface User {
  id: string;
  name: string;
  isActive: boolean;
  email: string;
  wabaId: string;
  phoneNumberId: string;
}

const mockUsers: User[] = [
  {id: '1', name: 'John Doe', isActive: true, email: 'john.doe@example.com', wabaId: 'waba123', phoneNumberId: 'phone123'},
  {id: '2', name: 'Jane Smith', isActive: false, email: 'jane.smith@example.com', wabaId: 'waba456', phoneNumberId: 'phone456'},
  {id: '3', name: 'Alice Johnson', isActive: true, email: 'alice.johnson@example.com', wabaId: 'waba789', phoneNumberId: 'phone789'},
];

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [message, setMessage] = useState<string | null>(null);
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
                <TableRow key={user.id}>
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
    </div>
  );
}
