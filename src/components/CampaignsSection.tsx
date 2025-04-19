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
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  TEMPLATES_API,
} from '@/lib/api-endpoints';

interface Campaign {
  id: string;
  name: string;
  description: string;
  created_at: string;
  platform: string;
  status: string | null;
  whatsapp_template_name: string | null;
}

interface CampaignsSectionProps {
  userId: string | undefined;
  initialCampaigns: Campaign[];
  initialTotalPages: number;
}

const ITEMS_PER_PAGE = 10;

export function CampaignsSection({ userId, initialCampaigns, initialTotalPages }: CampaignsSectionProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [campaignPage, setCampaignPage] = useState(1);
  const [campaignTotalPages, setCampaignTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${TEMPLATES_API}/?page=${campaignPage}&limit=10`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
            },
            body: JSON.stringify({
              user_id: userId,
            }),
          }
        );

        const data = await response.json();
        setCampaigns(data.templates || []);
        setCampaignTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        // toast({
        //   title: "Error",
        //   description: "Failed to fetch campaign templates.",
        //   variant: "destructive",
        // });
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [userId, campaignPage]);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>WhatsApp Template</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map(c => (
            <TableRow key={c.id}>
              <TableCell>{c.id}</TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.description}</TableCell>
              <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{c.platform}</TableCell>
              <TableCell>{c.status || '-'}</TableCell>
              <TableCell>{c.whatsapp_template_name || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button onClick={() => setCampaignPage(p => Math.max(p - 1, 1))} disabled={campaignPage === 1} variant="outline" size="sm">
          <Icons.chevronDown className="h-4 w-4 rotate-270" />
          Previous
        </Button>
        <span>Page {campaignPage} of {campaignTotalPages}</span>
        <Button onClick={() => setCampaignPage(p => Math.min(p + 1, campaignTotalPages))} disabled={campaignPage === campaignTotalPages} variant="outline" size="sm">
          Next
          <Icons.chevronDown className="h-4 w-4 rotate-90" />
        </Button>
      </div>
    </div>
  );
}
