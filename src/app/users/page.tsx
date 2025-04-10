'use client';

import {useState} from 'react';
import {Switch} from '@/components/ui/switch';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';

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

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [message, setMessage] = useState<string | null>(null);

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
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
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
    </div>
  );
}
