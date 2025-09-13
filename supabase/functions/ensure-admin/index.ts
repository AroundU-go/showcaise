// Ensure the admin user exists and is confirmed
// Endpoint: /functions/v1/ensure-admin
// Creates the admin user if missing and ensures their profile has is_admin=true

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { email, password } = await req.json();
    const allowedEmail = "go.aroundu@gmail.com";

    // Only operate for the configured admin email
    if (!email || email !== allowedEmail) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ ok: false, error: "Missing server configuration" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
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

    if (createErr && !String(createErr.message || "").toLowerCase().includes("exists")) {
      // Non-existence errors: return info but do not fail the flow
      console.warn("ensure-admin createUser error:", createErr.message);
    }

    // Ensure profile has is_admin=true
    const userId = created?.user?.id;

    if (userId) {
      await adminClient
        .from("profiles")
        .upsert({ user_id: userId, email: allowedEmail, is_admin: true }, { onConflict: "user_id" });
    } else {
      const { data: profile } = await adminClient
        .from("profiles")
        .select("user_id")
        .eq("email", allowedEmail)
        .maybeSingle();

      if (profile?.user_id) {
        await adminClient
          .from("profiles")
          .update({ is_admin: true })
          .eq("user_id", profile.user_id);
      }
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ensure-admin error:", e);
    return new Response(JSON.stringify({ ok: false, error: e?.message || "unknown" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
});
