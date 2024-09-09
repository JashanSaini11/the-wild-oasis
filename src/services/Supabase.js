import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://truixbxlbqrpxzgzoifg.supabase.co";
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWl4YnhsYnFycHh6Z3pvaWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI5MzI5NjMsImV4cCI6MjAzODUwODk2M30.-_5jLDOYTZ9stD8TqrPXeFVyUNbMEGQpdexrKoir2VM`;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
