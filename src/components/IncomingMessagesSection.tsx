"use client";

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  INCOMING_MESSAGES_API,
} from '@/lib/api-endpoints';

interface IncomingMessage {
  id: number;
  contact_name: string;
  wa_id: string;
  message_type: string;
  message_body: string;
  media_id: string | null;
  mime_type: string | null;
  timestamp: string;
  filename: string | null;
}

interface IncomingMessagesSectionProps {
  userId: string | undefined;
}

export function IncomingMessagesSection({ userId }: IncomingMessagesSectionProps) {
  const [incomingMessages, setIncomingMessages] = useState<IncomingMessage[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchIncomingMessages = async () => {
      try {
        const response = await fetch(INCOMING_MESSAGES_API as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            user_id: userId,
            page: 1,
            limit: 10, // Or any limit you want to set
          }),
        });

        const data = await response.json();
        setIncomingMessages(data.data || []);
      } catch (err) {
        console.error("Error fetching incoming messages:", err);
        // Consider using a toast here for error display
      }
    };

    fetchIncomingMessages();
  }, [userId]);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Contact Name</TableHead>
            <TableHead>WA ID</TableHead>
            <TableHead>Message Type</TableHead>
            <TableHead>Message Body</TableHead>
            <TableHead>Media ID</TableHead>
            <TableHead>Mime Type</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead>Filename</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomingMessages.map(msg => (
            <TableRow key={msg.id}>
              <TableCell>{msg.contact_name}</TableCell>
              <TableCell>{msg.wa_id}</TableCell>
              <TableCell>{msg.message_type}</TableCell>
              <TableCell>{msg.message_body}</TableCell>
              <TableCell>{msg.media_id}</TableCell>
              <TableCell>{msg.mime_type}</TableCell>
              <TableCell>{new Date(msg.timestamp).toLocaleString()}</TableCell>
              <TableCell>{msg.filename}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
