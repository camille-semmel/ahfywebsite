import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCog,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const AppSidebar = () => {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Team", path: "/team" },
    { icon: GraduationCap, label: "Students", path: "/students" },
    { icon: UserCog, label: "Therapist", path: "/therapist" },
    { icon: Settings, label: "Settings", path: "/settings" },
    // { icon: CreditCard, label: "Subscription", path: "/subscriptions" },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border p-6 flex flex-col min-h-screen">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-foreground">Menu</h2>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="space-y-2">
        <NavLink
          to="/support"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive
                ? "bg-primary text-primary-foreground font-medium"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`
          }
        >
          <HelpCircle className="w-5 h-5" />
          <span>Support</span>
        </NavLink>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 px-4 py-3 h-auto text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </Button>
      </div>
    </aside>
  );
};

export default AppSidebar;
