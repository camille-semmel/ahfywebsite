import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export type AccessLevel = "view" | "edit";

interface InviteFormProps {
  firstName: string;
  setFirstName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  access: AccessLevel;
  setAccess: (value: AccessLevel) => void;
  onSubmit: () => void;
  buttonText: string;
  isLinkTab: boolean;
}

const InviteForm = ({ 
  firstName, 
  setFirstName, 
  email, 
  setEmail, 
  access, 
  setAccess, 
  onSubmit, 
  buttonText,
  isLinkTab
}: InviteFormProps) => {

  const handleSubmit = () => {
    // First name validation
    if (!firstName.trim()) {
      toast({
        title: "First name required",
        description: "Please enter a first name",
        variant: "destructive",
      });
      return;
    }

    if (firstName.trim().length < 2) {
      toast({
        title: "Invalid first name",
        description: "First name must be at least 2 characters",
        variant: "destructive",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Call parent handler
    onSubmit();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder="Enter first name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full"
      />
      
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <Input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        
        <Select value={access} onValueChange={(value) => setAccess(value as AccessLevel)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="edit">Can edit</SelectItem>
            <SelectItem value="view">Can view</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSubmit} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default InviteForm;
