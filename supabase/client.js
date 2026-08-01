import { createClient } from 
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";


const supabaseUrl = "https://socaxjkikrxantwxacqy.supabase.co";

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvY2F4amtpa3J4YW50d3hhY3F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1MTMzNzEsImV4cCI6MjEwMTA4OTM3MX0.wBhxPka_CsqSVTQHjr3DS2ddvw_ezht4NToqTbzGzb4";


export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey
);
