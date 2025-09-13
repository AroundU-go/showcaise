// Ensure the admin user exists and is confirmed
// Endpoint: /functions/v1/ensure-admin
// Creates the admin user if missing and ensures their profile has is_admin=true

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const jsonHeaders = { "Content-Type": "application/json", ...corsHeaders };

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
        status: 405,
        headers: jsonHeaders,
      });
    }

    const { email, password } = await req.json();
    const allowedEmail = "go.aroundu@gmail.com";

    // Only operate for the configured admin email
    if (!email || email !== allowedEmail) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: jsonHeaders,
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ ok: false, error: "Missing server configuration" }), {
        status: 500,
        headers: jsonHeaders,
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Try to create the user (idempotent: if exists, ignore)
    const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { is_admin: true },
    });

    if (createErr) {
      const msg = String(createErr.message || "").toLowerCase();
      if (!msg.includes("exists")) {
        console.warn("ensure-admin createUser error:", createErr.message);
      }
    }

    // Ensure profile has is_admin=true and, if user exists, make sure password is updated
    const userId = created?.user?.id;

    if (userId) {
      await adminClient
        .from("profiles")
        .upsert({ user_id: userId, email: allowedEmail, is_admin: true }, { onConflict: "user_id" });
    } else {
      // If the user already exists, try to locate them via profiles to update password and admin flag
      const { data: profile } = await adminClient
        .from("profiles")
        .select("user_id")
        .eq("email", allowedEmail)
        .maybeSingle();

      if (profile?.user_id) {
        try {
          await adminClient.auth.admin.updateUserById(profile.user_id, {
            password,
            email_confirm: true,
            user_metadata: { is_admin: true },
          });
        } catch (e) {
          console.warn("ensure-admin updateUserById error:", e?.message || e);
        }

        await adminClient
          .from("profiles")
          .upsert({ user_id: profile.user_id, email: allowedEmail, is_admin: true }, { onConflict: "user_id" });
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: jsonHeaders,
    });
  } catch (e) {
    console.error("ensure-admin error:", e);
    return new Response(JSON.stringify({ ok: false, error: e?.message || "unknown" }), {
      status: 200,
      headers: jsonHeaders,
    });
  }
});
