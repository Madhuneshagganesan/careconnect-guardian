// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vtaddbfdhkwxgcicaney.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0YWRkYmZkaGt3eGdjaWNhbmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMDIzOTYsImV4cCI6MjA1ODU3ODM5Nn0.-vC_hdjg8-fRsrt0TJisJWfx6WFPIx9S8vNRO6UHTDI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);