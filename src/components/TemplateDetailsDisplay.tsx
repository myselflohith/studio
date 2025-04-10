"use client";

import {useEffect, useState} from "react";
import {getWabaTemplateDetails, WabaTemplate} from "@/services/waba";
import {Skeleton} from "@/components/ui/skeleton";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";

export function TemplateDetailsDisplay() {
  const [templateDetails, setTemplateDetails] = useState<WabaTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      setIsLoading(true);
      try {
        const details = await getWabaTemplateDetails("sample_template"); // Replace with actual template ID
        setTemplateDetails(details);
      } catch (error) {
        console.error("Failed to fetch template details:", error);
        setTemplateDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateDetails();
  }, []);

  return (
    <div className="container mx-auto py-4">
      <Table>
        <TableCaption>A list of your waba templates.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
              <TableCell>
                <Skeleton />
              </TableCell>
            </TableRow>
          ) : templateDetails ? (
            <TableRow>
              <TableCell className="font-medium">{templateDetails.name}</TableCell>
              <TableCell>{templateDetails.category}</TableCell>
              <TableCell>{templateDetails.status}</TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                No template details found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
