import { Button } from "@/components/ui/button";
import { Users, Link2 } from "lucide-react";

type TabType = "invited" | "link";

interface AccessTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  invitedCount: number;
}

const AccessTabs = ({ activeTab, onTabChange, invitedCount }: AccessTabsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Only those invited tab */}
      <button
        onClick={() => onTabChange("invited")}
        className={`p-6 rounded-lg border-2 text-left transition-all ${
          activeTab === "invited"
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/50"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            activeTab === "invited" ? "bg-primary/10" : "bg-muted"
          }`}>
            <Users className={`w-5 h-5 ${
              activeTab === "invited" ? "text-primary" : "text-muted-foreground"
            }`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Only those invited</h3>
            <p className="text-sm text-muted-foreground">
              {invitedCount} {invitedCount === 1 ? "person" : "people"}
            </p>
          </div>
        </div>
      </button>

      {/* Link Access tab */}
      <button
        onClick={() => onTabChange("link")}
        className={`p-6 rounded-lg border-2 text-left transition-all ${
          activeTab === "link"
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/50"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${
            activeTab === "link" ? "bg-primary/10" : "bg-muted"
          }`}>
            <Link2 className={`w-5 h-5 ${
              activeTab === "link" ? "text-primary" : "text-muted-foreground"
            }`} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Link Access</h3>
            <p className="text-sm text-muted-foreground">Link generator</p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default AccessTabs;
