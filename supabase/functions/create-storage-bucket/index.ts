
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create the 'public' bucket if it doesn't exist
    const { data: existingBuckets, error: getBucketsError } = await supabaseClient
      .storage
      .listBuckets();
    
    if (getBucketsError) {
      throw getBucketsError;
    }
    
    const publicBucketExists = existingBuckets.some(bucket => bucket.name === 'public');
    
    if (!publicBucketExists) {
      const { error: createBucketError } = await supabaseClient
        .storage
        .createBucket('public', { public: true });
      
      if (createBucketError) {
        throw createBucketError;
      }
    }
    
    return new Response(
      JSON.stringify({ message: 'Storage bucket "public" is ready' }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
