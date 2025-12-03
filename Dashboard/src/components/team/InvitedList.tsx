import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { AccessLevel } from "./InviteForm";

export interface TeamMember {
  id: string;
  first_name?: string;
  email: string;
  avatar?: string;
  access: AccessLevel | "owner";
}

interface InvitedListProps {
  members: TeamMember[];
  onAccessChange: (id: string, access: AccessLevel) => void;
  onRemove: (id: string) => void;
}

const InvitedList = ({ members, onAccessChange, onRemove }: InvitedListProps) => {
  // Helper to get initials from first name
  const getInitials = (firstName?: string) => {
    if (!firstName) return "??";
    return firstName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-3">
      {members.map((member) => {
        const isOwner = member.access === "owner";
        
        return (
          <div
            key={member.id}
            className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card"
          >
            {/* Avatar */}
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(member.first_name)}
              </AvatarFallback>
            </Avatar>

            {/* Name and Email */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">
                {member.first_name || member.email.split("@")[0]}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {member.email}
              </p>
            </div>

            {/* Access Control */}
            <div className="flex items-center gap-3">
              {isOwner ? (
                <div className="px-4 py-2 rounded-md bg-muted">
                  <span className="text-sm font-medium text-foreground">Owner</span>
                </div>
              ) : (
                <>
                  <Select
                    value={member.access as string}
                    onValueChange={(value) => onAccessChange(member.id, value as AccessLevel)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="edit">Can edit</SelectItem>
                      <SelectItem value="view">Can view</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(member.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InvitedList;
