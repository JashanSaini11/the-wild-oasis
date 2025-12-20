import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://sasbljkvfdkqfffjshgy.supabase.co";
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhc2Jsamt2ZmRrcWZmZmpzaGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NjgyNDMsImV4cCI6MjA4MTQ0NDI0M30.Xm36RuPoyqSwWTcRZeTV-nTZLKJA9NT6KtfpV6qmdtw`;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
      