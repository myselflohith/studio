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
  NUMBER_REPORT_API,
} from '@/lib/api-endpoints';

interface SearchCampaignsSectionProps {
  userId: string | undefined;
  phoneNumber: string;
}

interface SearchResult {
  campaign_id: string;
  template_name: string;
  status: string;
  sent_at: string;
  updated_at: string;
  wa_template_name: string | null;
}

const ITEMS_PER_PAGE = 10;

export function SearchCampaignsSection({ userId, phoneNumber }: SearchCampaignsSectionProps) {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchPage, setSearchPage] = useState(1);
  const [searchTotalPages, setSearchTotalPages] = useState(1);
  const [paginatedSearchResults, setPaginatedSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !phoneNumber) {
      setSearchResults([]);
      setSearchTotalPages(1);
      setPaginatedSearchResults([]);
      return;
    }

    const fetchPhoneSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(NUMBER_REPORT_API as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            phone_number: phoneNumber,
            user_id: userId,
          }),
        });

        const data = await response.json();
        const results = data.data || [];

        setSearchResults(results);
        setSearchTotalPages(Math.ceil(results.length / ITEMS_PER_PAGE));
        setPaginatedSearchResults(results.slice(0, ITEMS_PER_PAGE));
      } catch (err) {
        console.error("Failed to fetch campaign report:", err);
        // toast({
        //   title: "Error",
        //   description: "Failed to fetch campaign report.",
        //   variant: "destructive",
        // });
      } finally {
        setLoading(false);
      }
    };

    fetchPhoneSearchResults();
  }, [userId, phoneNumber]);

  useEffect(() => {
    const start = (searchPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    setPaginatedSearchResults(searchResults.slice(start, end));
  }, [searchPage, searchResults]);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign ID</TableHead>
            <TableHead>Template Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sent At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>WhatsApp Template</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedSearchResults.map((res) => (
            <TableRow key={res.campaign_id}>
              <TableCell>{res.campaign_id}</TableCell>
              <TableCell>{res.template_name}</TableCell>
              <TableCell>{res.status}</TableCell>
              <TableCell>{new Date(res.sent_at).toLocaleString()}</TableCell>
              <TableCell>{new Date(res.updated_at).toLocaleString()}</TableCell>
              <TableCell>{res.wa_template_name || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setSearchPage(p => Math.max(p - 1, 1))}
          disabled={searchPage === 1}
          variant="outline"
          size="sm"
        >
          <Icons.chevronDown className="h-4 w-4 rotate-270" />
          Previous
        </Button>
        <span>Page {searchPage} of {searchTotalPages}</span>
        <Button
          onClick={() => setSearchPage(p => Math.min(p + 1, searchTotalPages))}
          disabled={searchPage === searchTotalPages}
          variant="outline"
          size="sm"
        >
          Next
          <Icons.chevronDown className="h-4 w-4 rotate-90" />
        </Button>
      </div>
    </div>
  );
}
