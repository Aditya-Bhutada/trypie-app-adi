
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { getSupabaseClient } from "../_shared/supabase-client.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  email: string;
  groupId: string;
  groupName: string;
  inviterName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received invitation request");
    const { email, groupId, groupName, inviterName }: InvitationRequest = await req.json();
    const supabase = getSupabaseClient(req);

    if (!email || !groupId || !groupName) {
      console.error("Missing required fields:", { email, groupId, groupName });
      throw new Error("Missing required fields for invitation");
    }

    // Generate a unique token for the invitation (allow multiple links)
    const token = crypto.randomUUID();

    // Create a URL for the invitation link
    const baseUrl = req.headers.get("origin") || "https://trypie-app.vercel.app";
    const inviteUrl = `${baseUrl}/groups/invitation?token=${token}`;

    // Extract user ID from JWT token
    const authHeader = req.headers.get('Authorization') || '';
    let invitedBy = null;

    if (authHeader.startsWith('Bearer ')) {
      const jwt = authHeader.substring(7);
      try {
        // Parse the JWT payload
        const base64Payload = jwt.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        invitedBy = payload.sub; // This is the user ID
      } catch (e) {
        console.error("Failed to parse JWT:", e);
      }
    }

    console.log("Storing invitation in database for", email);

    // Store the invitation in the database (make sure email is present)
    const { data, error: dbError } = await supabase
      .from('group_invitations')
      .insert({
        group_id: groupId,
        email: email,
        token: token,
        invited_by: invitedBy,
        status: 'pending',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select();

    if (dbError) {
      console.error("Error storing invitation:", dbError);
      throw new Error(`Failed to store invitation: ${JSON.stringify(dbError)}`);
    }

    console.log("Sending email invitation to:", email);

    let emailSent = false;
    let sendError = null;

    // Send the email invitation with proper error handling
    try {
      const emailResponse = await resend.emails.send({
        from: "Trypie Travel <onboarding@resend.dev>",
        to: [email],
        subject: `You're invited to join ${groupName} on Trypie!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #6366F1; color: white; padding: 20px; text-align: center;">
              <h1>Trypie Travel Invitation</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #eaeaea; border-top: none; background: white;">
              <p>Hello!</p>
              <p>${inviterName} has invited you to join their travel group "${groupName}" on Trypie.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${inviteUrl}" style="background-color: #6366F1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                  Join the Group
                </a>
              </div>
              <p style="color: #666;">This invitation link will remain active for 30 days.</p>
              <p style="color: #666;">If you can't click the button, copy and paste this URL into your browser: ${inviteUrl}</p>
            </div>
            <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
              <p>© 2025 Trypie. All rights reserved.</p>
            </div>
          </div>
        `
      });

      console.log("Email sending result:", emailResponse);

      if (emailResponse.error) {
        sendError = emailResponse.error.message;
        console.error("Error from Resend:", emailResponse.error);
      } else {
        emailSent = true;
        console.log("Email sent successfully to:", email);
      }
    } catch (emailError: any) {
      sendError = emailError?.message || `${emailError}`;
      console.error("Failed to send email:", emailError);
    }

    return new Response(JSON.stringify({
      success: true,
      token,
      inviteUrl,
      emailSent,
      emailError: sendError,
      recipientEmail: email
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending invitation:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
