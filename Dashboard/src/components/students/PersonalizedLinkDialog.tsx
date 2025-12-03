import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface PersonalizedLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName: string;
}

const TESTFLIGHT_LINK = 'https://testflight.apple.com/join/vRd5t9Mg';

export const PersonalizedLinkDialog = ({
  open,
  onOpenChange,
  studentName,
}: PersonalizedLinkDialogProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(TESTFLIGHT_LINK);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>App Download Link</DialogTitle>
          <DialogDescription>
            Share this TestFlight link with {studentName} to download the app
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              {TESTFLIGHT_LINK}
            </div>
          </div>
          <Button size="sm" className="px-3" onClick={handleCopy}>
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
