import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Database {
  public: {
    Tables: {
      apps: {
        Row: {
          id: string;
          name: string;
          tagline: string;
          description: string;
          website_url: string;
          logo_url?: string;
          maker_email: string;
          category: string;
          status: string;
          vote_count: number;
          created_at: string;
        };
        Insert: {
          name: string;
          tagline: string;
          description: string;
          website_url: string;
          logo_url?: string;
          maker_email: string;
          category: string;
          status?: string;
          vote_count?: number;
        };
      };
    };
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Sample AI apps data
    const sampleApps = [
      {
        name: "ChatGenius",
        tagline: "AI-powered conversation assistant for teams",
        description: "ChatGenius revolutionizes team communication with advanced AI that understands context, generates smart responses, and helps automate routine conversations. Perfect for customer support, internal communications, and project coordination.",
        website_url: "https://chatgenius.ai",
        maker_email: "founder@chatgenius.ai",
        category: "Productivity",
        status: "approved",
        vote_count: 42,
      },
      {
        name: "CodeCraft AI",
        tagline: "Transform ideas into code with intelligent AI assistance",
        description: "CodeCraft AI is the ultimate coding companion that helps developers write, debug, and optimize code across multiple programming languages. Features include intelligent code completion, bug detection, and automated documentation generation.",
        website_url: "https://codecraft.dev",
        maker_email: "dev@codecraft.dev",
        category: "Engineering & Development",
        status: "approved",
        vote_count: 38,
      },
      {
        name: "DesignSpark",
        tagline: "Generate stunning designs with AI creativity",
        description: "DesignSpark empowers designers and non-designers alike to create professional-quality graphics, logos, and marketing materials using advanced AI algorithms. From concept to completion in minutes.",
        website_url: "https://designspark.io",
        maker_email: "hello@designspark.io",
        category: "Design & Creative",
        status: "approved",
        vote_count: 56,
      },
      {
        name: "FinanceBot Pro",
        tagline: "Smart financial planning with AI insights",
        description: "FinanceBot Pro provides personalized financial advice, investment recommendations, and budget optimization using machine learning algorithms that analyze your spending patterns and financial goals.",
        website_url: "https://financebot.pro",
        maker_email: "team@financebot.pro",
        category: "Finance",
        status: "approved",
        vote_count: 29,
      },
      {
        name: "SocialPulse",
        tagline: "AI-driven social media content creation and analytics",
        description: "SocialPulse helps businesses and creators maximize their social media impact with AI-generated content, optimal posting times, and deep audience analytics. Grow your following with data-driven insights.",
        website_url: "https://socialpulse.app",
        maker_email: "info@socialpulse.app",
        category: "Marketing & Sales",
        status: "approved",
        vote_count: 33,
      },
      {
        name: "HealthMind AI",
        tagline: "Personal wellness coach powered by artificial intelligence",
        description: "HealthMind AI combines nutrition science, exercise physiology, and mental health research to provide personalized wellness recommendations. Track your progress and receive AI-powered insights for optimal health.",
        website_url: "https://healthmind.ai",
        maker_email: "support@healthmind.ai",
        category: "Health & Fitness",
        status: "approved",
        vote_count: 45,
      },
      {
        name: "TravelGenie",
        tagline: "AI travel planner for perfect vacations",
        description: "TravelGenie creates personalized travel itineraries based on your preferences, budget, and interests. Discover hidden gems, find the best deals, and plan unforgettable trips with intelligent recommendations.",
        website_url: "https://travelgenie.world",
        maker_email: "hello@travelgenie.world",
        category: "Travel",
        status: "approved",
        vote_count: 51,
      },
      {
        name: "AI Agent Builder",
        tagline: "Create custom AI agents without coding",
        description: "Build sophisticated AI agents for any use case with our no-code platform. From customer service bots to data analysis assistants, create powerful AI helpers that integrate with your existing workflows.",
        website_url: "https://agentbuilder.io",
        maker_email: "builders@agentbuilder.io",
        category: "AI Agents",
        status: "approved",
        vote_count: 67,
      },
      {
        name: "LLM Studio",
        tagline: "Fine-tune and deploy large language models",
        description: "LLM Studio provides enterprise-grade tools for training, fine-tuning, and deploying large language models. Customize AI behavior for your specific domain with advanced machine learning capabilities.",
        website_url: "https://llmstudio.dev",
        maker_email: "research@llmstudio.dev",
        category: "LLMs",
        status: "approved",
        vote_count: 72,
      },
    ];

    // Check if data already exists
    const { data: existingApps } = await supabase
      .from('apps')
      .select('id')
      .limit(1);

    if (existingApps && existingApps.length > 0) {
      return new Response(
        JSON.stringify({ 
          message: 'Sample data already exists',
          count: existingApps.length 
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert sample apps
    const { data, error } = await supabase
      .from('apps')
      .insert(sampleApps);

    if (error) {
      console.error('Error inserting sample data:', error);
      throw error;
    }

    console.log('Sample data populated successfully');

    return new Response(
      JSON.stringify({ 
        message: 'Sample data populated successfully',
        count: sampleApps.length,
        apps: data
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in populate-sample-data function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred',
        details: error.details || null
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);