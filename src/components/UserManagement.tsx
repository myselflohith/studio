"use client";

import {useState} from "react";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";
import {Card} from "@/components/ui/card";

export function UserManagement() {
  const [userId, setUserId] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleToggleActive = () => {
    // Simulate user activation/deactivation
    console.log(`User ${userId} is now ${isActive ? "inactive" : "active"}`);
    setMessage(`User ${userId} is now ${isActive ? "inactive" : "active"}`);
  };

  return (
    <Card className="w-full">
      <div className="flex flex-col space-y-4">
        <Label htmlFor="userId">User ID:</Label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <div className="flex items-center space-x-2">
          <Label htmlFor="active">Active:</Label>
          <Switch id="active" checked={isActive} onCheckedChange={(checked) => setIsActive(checked)} />
        </div>

        <Button onClick={handleToggleActive}>Update Status</Button>

        {message && <p className="text-sm text-green-500">{message}</p>}
      </div>
    </Card>
  );
}
