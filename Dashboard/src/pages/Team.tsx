import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import InviteForm, { AccessLevel } from "@/components/team/InviteForm";
import AccessTabs from "@/components/team/AccessTabs";
import InvitedList, { TeamMember } from "@/components/team/InvitedList";
import LinkAccessPanel from "@/components/team/LinkAccessPanel";
import TeamMembersPagination from "@/components/team/TeamMembersPagination";

type TabType = "invited" | "link";

const Team = () => {
  const [activeTab, setActiveTab] = useState<TabType>("invited");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const MEMBERS_PER_PAGE = 4;
  const totalPages = Math.ceil(totalMembers / MEMBERS_PER_PAGE);

  // Shared form state for both invite and link generation
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [access, setAccess] = useState<AccessLevel>("view");
  const [generatedLink, setGeneratedLink] = useState("");

  useEffect(() => {
    fetchTeamMembers();
  }, [currentPage]);

  const fetchTeamMembers = async () => {
    setLoading(true);
    try {
      // Get total count
      const { count } = await supabase
        .from("university_portal_access_data")
        .select("*", { count: "exact", head: true });

      setTotalMembers(count || 0);

      // Fetch paginated data
      const from = (currentPage - 1) * MEMBERS_PER_PAGE;
      const to = from + MEMBERS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from("university_portal_access_data")
        .select("id, first_name, email, access_level")
        .order("access_level", { ascending: true }) // Owner first
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Map database fields to UI TeamMember interface
      const mappedMembers: TeamMember[] = (data || []).map((item) => ({
        id: item.id,
        first_name: item.first_name,
        email: item.email,
        access: item.access_level as AccessLevel | "owner",
      }));

      setMembers(mappedMembers);
    } catch (error) {
      console.error("Error fetching team members:", error);
      toast({
        title: "Error loading team",
        description: "Failed to load team members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!firstName.trim() || !email.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both first name and email",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Check if email already exists
      const { data: existing } = await supabase
        .from("university_portal_access_data")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (existing) {
        toast({
          title: "Already invited",
          description: `${email} is already a team member`,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Get current user's ID for invited_by
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Insert new member with access_method = 'manual'
      const { data, error } = await supabase
        .from("university_portal_access_data")
        .insert({
          first_name: firstName,
          email: email,
          access_level: access,
          access_method: "manual",
          invited_by: user?.id,
        })
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      console.log("Team member added to database, sending invitation email...");

      // Fetch institution name for email
      const { data: institutionData } = await supabase
        .schema("public")
        .from("institution_settings")
        .select("institution_name")
        .single();

      // Send invitation email via edge function
      const { data: emailData, error: emailError } =
        await supabase.functions.invoke("send-team-invitation", {
          body: {
            firstName: firstName,
            email: email,
            accessLevel: access,
            invitedByName: user?.email || "Your team administrator",
            institutionName:
              institutionData?.institution_name || "your institution",
          },
        });

      if (emailError) {
        console.error("Failed to send invitation email:", emailError);
        // Show partial success - user added but email failed
        toast({
          title: "Invitation created",
          description: `${firstName} was added to the team, but the invitation email could not be sent. Please contact them manually.`,
          variant: "default",
        });
      } else {
        console.log("Invitation email sent successfully:", emailData);
        // Full success
        toast({
          title: "Invitation sent",
          description: `${firstName} has been invited via email to join the team`,
        });
      }

      // Clear form
      setFirstName("");
      setEmail("");
      setAccess("view");

      // Refresh the list
      fetchTeamMembers();
    } catch (error: any) {
      console.error("Error inviting member:", error);

      let errorMessage = "Failed to send invitation";
      if (error?.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Invitation failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLink = async () => {
    try {
      // Generate unique token
      const token =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      const link = `${window.location.origin}/shared/${token}`;

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Store link information in database with actual name and email
      const { error } = await supabase
        .from("university_portal_access_data")
        .insert({
          first_name: firstName.trim(),
          email: email.trim().toLowerCase(),
          access_level: access,
          access_method: "link",
          shared_link: token,
          invited_by: user?.id,
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Email already exists",
            description: "This email is already associated with a team member",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      setGeneratedLink(link);

      toast({
        title: "Link generated",
        description: "Your shareable link is ready to copy",
      });

      // Clear form
      setFirstName("");
      setEmail("");
      setAccess("view");

      // Refresh the list
      fetchTeamMembers();
    } catch (error) {
      console.error("Error generating link:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate shareable link",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;

    try {
      await navigator.clipboard.writeText(generatedLink);
      toast({
        title: "Link copied",
        description: "Shareable link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const handleAccessChange = async (id: string, access: AccessLevel) => {
    try {
      // Prevent changing owner access
      const member = members.find((m) => m.id === id);
      if (member?.access === "owner") {
        toast({
          title: "Cannot modify owner",
          description: "Owner access cannot be changed",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("university_portal_access_data")
        .update({
          access_level: access,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      // Update local state
      setMembers(members.map((m) => (m.id === id ? { ...m, access } : m)));

      toast({
        title: "Access updated",
        description: "Team member access has been updated",
      });
    } catch (error) {
      console.error("Error updating access:", error);
      toast({
        title: "Update failed",
        description: "Failed to update access level",
        variant: "destructive",
      });
    }
  };

  const handleRemove = async (id: string) => {
    try {
      // Prevent removing owner
      const member = members.find((m) => m.id === id);
      if (member?.access === "owner") {
        toast({
          title: "Cannot remove owner",
          description: "The owner cannot be removed",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("university_portal_access_data")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Member removed",
        description: `${member?.first_name} has been removed from the team`,
      });

      // Refresh list and adjust pagination if needed
      const newTotal = totalMembers - 1;
      const newTotalPages = Math.ceil(newTotal / MEMBERS_PER_PAGE);

      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      } else {
        fetchTeamMembers();
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast({
        title: "Removal failed",
        description: "Failed to remove team member",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Share & Access</h1>
          <p className="text-muted-foreground mt-2">
            Invite others or share a link to collaborate
          </p>
        </div>

        {/* Invite Form */}
        <div className="p-6 rounded-lg border border-border bg-card">
          <InviteForm
            firstName={firstName}
            setFirstName={setFirstName}
            email={email}
            setEmail={setEmail}
            access={access}
            setAccess={setAccess}
            onSubmit={
              activeTab === "invited" ? handleInvite : handleGenerateLink
            }
            buttonText={activeTab === "invited" ? "Invite" : "Generate Link"}
            isLinkTab={activeTab === "link"}
          />
        </div>

        {/* Access Control Tabs */}
        <AccessTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          invitedCount={totalMembers}
        />

        {/* Content Sections */}
        <div className="min-h-[400px]">
          {activeTab === "invited" ? (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Team Members
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Loading team members...
                  </p>
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-8 border border-border rounded-lg bg-card">
                  <p className="text-muted-foreground">
                    No team members yet. Invite someone to get started!
                  </p>
                </div>
              ) : (
                <>
                  <InvitedList
                    members={members}
                    onAccessChange={handleAccessChange}
                    onRemove={handleRemove}
                  />

                  <TeamMembersPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalMembers={totalMembers}
                  />
                </>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Shareable Link
              </h2>
              <LinkAccessPanel
                generatedLink={generatedLink}
                onCopyLink={handleCopyLink}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Team;
