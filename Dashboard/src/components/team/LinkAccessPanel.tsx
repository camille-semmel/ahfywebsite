import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

interface LinkAccessPanelProps {
  generatedLink: string;
  onCopyLink: () => void;
}

const LinkAccessPanel = ({ generatedLink, onCopyLink }: LinkAccessPanelProps) => {

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          Fill in the name, email, and permission above, then click "Generate Link" to create a shareable access link.
        </p>
      </div>

      {/* Generated link display */}
      {generatedLink && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={generatedLink}
              readOnly
              className="flex-1 font-mono text-sm"
            />
            <Button onClick={onCopyLink} variant="outline">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkAccessPanel;
