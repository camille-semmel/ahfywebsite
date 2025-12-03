import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SeatRequestData {
  name: string;
  organization: string;
  currentSeats: {
    used: number;
    total: number;
  };
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Seat request function invoked");
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, organization, currentSeats }: SeatRequestData = await req.json();
    
    console.log("Received request:", { name, organization, currentSeats });

    // Validate inputs
    if (!name || name.trim().length === 0) {
      console.error("Validation failed: Name is required");
      return new Response(
        JSON.stringify({ error: "Name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!organization || organization.trim().length === 0) {
      console.error("Validation failed: Organization is required");
      return new Response(
        JSON.stringify({ error: "Organization is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!currentSeats || !currentSeats.used || !currentSeats.total) {
      console.error("Validation failed: Current seats data is required");
      return new Response(
        JSON.stringify({ error: "Current seats data is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "University Portal <onboarding@resend.dev>",
      to: ["admin@university.edu"], // TODO: Replace with actual admin email
      subject: `Seat Increase Request from ${organization}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #FF9550; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f5f5f5; padding: 30px; border-radius: 0 0 8px 8px; }
              .info-row { margin: 15px 0; }
              .label { font-weight: bold; color: #555; }
              .value { color: #333; }
              .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>New Seat Increase Request</h1>
              </div>
              <div class="content">
                <div class="info-row">
                  <span class="label">Requester Name:</span>
                  <span class="value">${name}</span>
                </div>
                <div class="info-row">
                  <span class="label">Organization:</span>
                  <span class="value">${organization}</span>
                </div>
                <div class="info-row">
                  <span class="label">Current Seat Usage:</span>
                  <span class="value">${currentSeats.used}/${currentSeats.total} seats</span>
                </div>
                <div class="info-row">
                  <span class="label">Request Date:</span>
                  <span class="value">${new Date().toLocaleString()}</span>
                </div>
              </div>
              <div class="footer">
                <p>This is an automated message from the University Mental Wellbeing Portal</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, data: emailResponse }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in send-seat-request function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send request" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
