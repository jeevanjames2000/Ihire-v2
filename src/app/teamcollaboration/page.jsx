"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, List } from "lucide-react";

export default function TeamCollaborationHome() {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#44a6b1] to-[#7ed3de] p-6">
      <Card className="w-full max-w-md shadow-2xl rounded-3xl">
        <CardHeader className="text-center bg-[#44a6b1] text-white rounded-t-3xl">
          <CardTitle className="text-2xl font-semibold tracking-wide">
            Team Collaboration Dashboard
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 flex flex-col gap-6">
          <Button
            onClick={() => router.push("/teamcollaboration/invites")}
            className="w-full flex items-center justify-center gap-2 text-lg bg-[#44a6b1] hover:bg-[#3a929d] text-white py-6 rounded-xl shadow-md"
          >
            <Users className="w-5 h-5" />
            Team Collaboration
          </Button>

          <Button
            onClick={() => router.push("/teamcollaboration/invitesList")}
            className="w-full flex items-center justify-center gap-2 text-lg bg-white text-[#44a6b1] border-2 border-[#44a6b1] hover:bg-[#e0f6f8] py-6 rounded-xl shadow-md"
          >
            <List className="w-5 h-5" />
            Team Collaboration List
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
