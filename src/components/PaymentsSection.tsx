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
  PAYMENTS_API,
} from '@/lib/api-endpoints';

interface Payment {
  payment_id: number;
  user_id: number;
  payment_method: string;
  payment_date: string;
  transaction_type: string;
  amount: string;
  campaign_id: number;
}

interface PaymentsSectionProps {
  userId: string | undefined;
  initialPayments: Payment[];
  initialTotalPages: number;
  paymentTotals: { debit: string; credit: string; refund: string; };
}

const ITEMS_PER_PAGE = 10;

export function PaymentsSection({ userId, initialPayments, initialTotalPages, paymentTotals }: PaymentsSectionProps) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentTotalPages, setPaymentTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);
  const formatINR = (value: string | number): string =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value));

  useEffect(() => {
    if (!userId) return;

    const fetchPayments = async () => {
      setLoading(true);
      try {
        const response = await fetch(PAYMENTS_API as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            user_id: userId,
            page: paymentPage,
            limit: ITEMS_PER_PAGE,
          }),
        });

        const data = await response.json();
        setPayments(data.data || []);
        setPaymentTotalPages(data.pagination?.total_pages || 1);
        // setPaymentTotals(data.totals || { debit: '0', credit: '0', refund: '0' }); // commented out to use initial prop

      } catch (err) {
        console.error("Error fetching payment data:", err);
        // toast({
        //   title: "Error",
        //   description: "Failed to fetch payment data.",
        //   variant: "destructive",
        // });
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [userId, paymentPage]);

  return (
    <div>
      <div className="mb-3 text-sm">
        <p>Total Credit: Rs. {formatINR(paymentTotals.credit)}</p>
        <p>Total Debit: Rs. {formatINR(paymentTotals.debit)}</p>
        <p>Total Refund: Rs. {formatINR(paymentTotals.refund)}</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Campaign ID</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map(p => (
            <TableRow key={p.payment_id}>
              <TableCell>{p.payment_id}</TableCell>
              <TableCell>{p.payment_method}</TableCell>
              <TableCell>{p.transaction_type}</TableCell>
              <TableCell>Rs. {p.amount}</TableCell>
              <TableCell>{p.campaign_id}</TableCell>
              <TableCell>{new Date(p.payment_date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button onClick={() => setPaymentPage(p => Math.max(p - 1, 1))} disabled={paymentPage === 1} variant="outline" size="sm">
          <Icons.chevronDown className="h-4 w-4 rotate-270" />
          Previous
        </Button>
        <span>Page {paymentPage} of {paymentTotalPages}</span>
        <Button onClick={() => setPaymentPage(p => Math.min(p + 1, paymentTotalPages))} disabled={paymentPage === paymentTotalPages} variant="outline" size="sm">
          Next
          <Icons.chevronDown className="h-4 w-4 rotate-90" />
        </Button>
      </div>
    </div>
  );
}
