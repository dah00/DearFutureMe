import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://uhioliennjfqifvfmuuc.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaW9saWVubmpmcWlmdmZtdXVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzUyMjEsImV4cCI6MjA3Njc1MTIyMX0.UnmxVR883TVw9XCGIiloxgpz1GUmAIZkwrKEqX5_K3c";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export types for TypeScript support
export type Database = {
  // Define our database schema here later
};
