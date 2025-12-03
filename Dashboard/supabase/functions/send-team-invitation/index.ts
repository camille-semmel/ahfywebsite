import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("Ahfy_RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationEmailRequest {
  firstName: string;
  email: string;
  accessLevel: "view" | "edit";
  invitedByName?: string;
  institutionName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Team invitation email function invoked");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      firstName, 
      email, 
      accessLevel, 
      invitedByName, 
      institutionName 
    }: InvitationEmailRequest = await req.json();
    
    console.log("Received invitation request for:", email);

    // Validate required fields
    if (!firstName || firstName.trim().length === 0) {
      console.error("Validation failed: First name is required");
      return new Response(
        JSON.stringify({ error: "First name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!email || email.trim().length === 0) {
      console.error("Validation failed: Email is required");
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Validation failed: Invalid email format");
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!accessLevel || !["view", "edit"].includes(accessLevel)) {
      console.error("Validation failed: Invalid access level");
      return new Response(
        JSON.stringify({ error: "Invalid access level" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine access level display text
    const accessLevelText = accessLevel === "view" ? "Can view data" : "Can view and edit data";
    
    // Build signup link with pre-filled email
    const signupLink = `https://dkmthdkrrdcctzxcpxsz.supabase.co/signup?email=${encodeURIComponent(email)}`;

    // Build invitation email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              background-color: #f5f5f5;
            }
            .container { 
              max-width: 600px; 
              margin: 40px auto; 
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }
            .header { 
              background: linear-gradient(135deg, #FF9550 0%, #FF7A2F 100%); 
              padding: 40px 30px; 
              text-align: center;
            }
            .header h1 {
              color: #ffffff;
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content { 
              padding: 40px 30px;
              color: #333333;
              line-height: 1.6;
            }
            .greeting {
              font-size: 18px;
              margin-bottom: 20px;
              color: #333333;
            }
            .info-box {
              background-color: #f9f9f9;
              border-left: 4px solid #FF9550;
              padding: 20px;
              margin: 25px 0;
            }
            .info-box p {
              margin: 8px 0;
              color: #555555;
            }
            .info-box strong {
              color: #333333;
            }
            .cta-container {
              text-align: center;
              margin: 35px 0;
            }
            .cta-button {
              display: inline-block;
              background-color: #FF9550;
              color: #ffffff;
              text-decoration: none;
              padding: 16px 45px;
              border-radius: 6px;
              font-weight: 600;
              font-size: 16px;
              transition: background-color 0.3s ease;
            }
            .cta-button:hover {
              background-color: #FF7A2F;
            }
            .footer {
              background-color: #f5f5f5;
              padding: 25px 30px;
              text-align: center;
              font-size: 13px;
              color: #666666;
            }
            .footer p {
              margin: 5px 0;
            }
            .divider {
              height: 1px;
              background-color: #e0e0e0;
              margin: 30px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Ahfy</h1>
            </div>
            
            <div class="content">
              <p class="greeting">Hi ${firstName},</p>
              
              <p>
                ${invitedByName || 'Your team'} has invited you to join the 
                <strong>${institutionName || 'university'}</strong> mental wellbeing portal on Ahfy.
              </p>
              
              <div class="info-box">
                <p><strong>Your Access Level:</strong></p>
                <p>${accessLevelText}</p>
                <p style="margin-top: 15px; font-size: 14px; color: #666;">
                  You'll be able to view student wellbeing data, dashboard metrics, and collaborate with your team.
                </p>
              </div>
              
              <div class="cta-container">
                <a href="${signupLink}" class="cta-button">
                  Accept Invitation
                </a>
              </div>
              
              <p style="color: #666666; font-size: 14px; text-align: center;">
                Click the button above to create your account and start collaborating with your team.
              </p>
              
              <div class="divider"></div>
              
              <p style="color: #888888; font-size: 13px;">
                If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </div>
            
            <div class="footer">
              <p><strong>Ahfy</strong></p>
              <p>University Mental Wellbeing Platform</p>
              <p style="margin-top: 15px;">
                <a href="mailto:support@ahfy.app" style="color: #FF9550; text-decoration: none;">support@ahfy.app</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send invitation email via Resend
    const emailResponse = await resend.emails.send({
      from: "Ahfy Team <support@ahfy.app>",
      to: [email],
      subject: `You've been invited to join ${institutionName || 'your institution'} on Ahfy`,
      html: emailHtml,
    });

    console.log("Invitation email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-team-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send invitation email" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
