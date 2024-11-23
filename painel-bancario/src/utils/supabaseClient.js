import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snclybxvhuiuctfnqibd.supabase.co'; // Substitua pela URL do seu projeto
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuY2x5Ynh2aHVpdWN0Zm5xaWJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NTUzMjcsImV4cCI6MjA0NzUzMTMyN30.HeI1Jh1_9HHIOxI39KhNs_QTKY3_5_TTfDT4j9gp4zo'; // Substitua pela sua chave pública (anon key)

export const supabase = createClient(supabaseUrl, supabaseKey);
