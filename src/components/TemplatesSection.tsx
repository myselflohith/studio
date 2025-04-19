"use client";

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TEMPLATES_API,
} from '@/lib/api-endpoints';

interface Template {
  id: number;
  name: string;
  code: string;
  userid: number;
  wa_template_id: string;
  wa_template_status: string;
  wa_template_category: string;
}

interface TemplatesSectionProps {
  userId: string | undefined;
}

export function TemplatesSection({ userId }: TemplatesSectionProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const response = await fetch(TEMPLATES_API as string, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            user_id: userId,
          }),
        });

        const data = await response.json();
        setTemplates(data.templates || []);
      } catch (err) {
        console.error("Error fetching templates:", err);
        // toast({
        //   title: "Error",
        //   description: "Failed to fetch templates.",
        //   variant: "destructive",
        // });
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [userId]);

  return (
    <div>
      {loading && <p>Loading templates...</p>}
      {!loading && templates.length === 0 && <p>No templates found for this user.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {templates.map(template => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Template Code: {template.code}</p>
              <p>WhatsApp Template ID: {template.wa_template_id}</p>
              <p>Status: {template.wa_template_status}</p>
              <p>Category: {template.wa_template_category}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
