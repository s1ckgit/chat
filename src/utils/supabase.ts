import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://bgcohmfoufkfrcyvhaiv.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnY29obWZvdWZrZnJjeXZoYWl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzAzNjg1OTEsImV4cCI6MjA0NTk0NDU5MX0.0AqH4Fk2vJmH5OhYtt4HFzUWmlKpA3LwqgbL0yq5b9U');

export default supabase;
