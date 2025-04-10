"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Card} from "@/components/ui/card";

export function BalanceManagement() {
  const [userId, setUserId] = useState("");
  const [balanceToAdd, setBalanceToAdd] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const handleAddBalance = () => {
    if (!userId || !balanceToAdd) {
      setMessage("Please enter User ID and Balance.");
      return;
    }

    // Simulate adding balance to user
    console.log(`Adding $${balanceToAdd} to user ${userId}`);
    setMessage(`Successfully added $${balanceToAdd} to user ${userId}`);

    // Clear the input fields
    setUserId("");
    setBalanceToAdd("");
  };

  return (
    <Card className="w-full">
      <div className="flex flex-col space-y-4">
        <Label htmlFor="userId">User ID:</Label>
        <Input
          type="text"
          id="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Enter User ID"
        />

        <Label htmlFor="balance">Balance to Add:</Label>
        <Input
          type="number"
          id="balance"
          value={balanceToAdd}
          onChange={(e) => setBalanceToAdd(e.target.value)}
          placeholder="Enter Balance"
        />

        <Button onClick={handleAddBalance}>Add Balance</Button>

        {message && <p className="text-sm text-green-500">{message}</p>}
      </div>
    </Card>
  );
}
