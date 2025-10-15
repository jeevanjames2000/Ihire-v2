"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Building2 } from "lucide-react";
export const dynamic = 'force-dynamic';
export default function CompanyInviteList() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const API_BASE = "http://localhost:5000/api/invites";
  const token =
    "gbumba";


  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchInvites();
  }, []);


  const fetchInvites = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/RecruiterInvites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvites(data.invites || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch invites");
    } finally {
      setLoading(false);
    }
  };

 
  const handleDeleteInvite = async (inviteId, invitedEmail) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the invite for ${invitedEmail}? This action cannot be undone.`
      )
    )
      return;

    try {
      await axios.delete(`${API_BASE}/deleteInvites/${inviteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInvites((prev) => prev.filter((i) => i.id !== inviteId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete invite");
    }
  };


  const getStatusLabel = (used) => (used === 1 ? "Accepted" : "Pending");
  const getBadgeVariant = (used) => (used === 1 ? "success" : "secondary");

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-600 text-lg">
        Loading...
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <Card className="bg-[#44a6b1] shadow-2xl rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-[#44a6b1] text-white">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Building2 className="h-5 w-5" /> Company Invites
          </CardTitle>
        </CardHeader>

        <CardContent className="bg-white p-6">
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invited By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>{invite.email}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(invite.used)}>
                      {getStatusLabel(invite.used)}
                    </Badge>
                  </TableCell>
                  <TableCell>{invite.invited_by_name}</TableCell>
                  <TableCell>
                    {new Date(invite.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDeleteInvite(invite.id, invite.email)
                      }
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {invites.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No invites found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
