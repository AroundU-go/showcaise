import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotifyRequest {
  appName: string;
  appTagline: string;
  appCategory: string;
  makerEmail: string;
  websiteUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appName, appTagline, appCategory, makerEmail, websiteUrl }: NotifyRequest = await req.json();

    console.log("Sending notification for new app submission:", appName);

    const emailResponse = await resend.emails.send({
      from: "Showcaise <onboarding@resend.dev>",
      to: ["uddipangoswami101@gmail.com"],
      subject: `New App Submission: ${appName}`,
      html: `
        <h1>New App Submitted for Approval</h1>
        <p>A new app has been submitted to Showcaise and requires your approval.</p>
        
        <h2>App Details:</h2>
        <ul>
          <li><strong>Name:</strong> ${appName}</li>
          <li><strong>Tagline:</strong> ${appTagline}</li>
          <li><strong>Category:</strong> ${appCategory}</li>
          <li><strong>Website:</strong> <a href="${websiteUrl}">${websiteUrl}</a></li>
          <li><strong>Maker Email:</strong> ${makerEmail}</li>
        </ul>
        
        <p>Please log in to the admin dashboard to review and approve this submission.</p>
        
        <p>Best regards,<br>Showcaise Team</p>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in notify-new-app function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
