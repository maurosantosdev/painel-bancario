import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://snclybxvhuiuctfnqibd.supabase.co'; // Substitua pela URL do seu projeto
const supabaseKey = ''; // Substitua pela sua chave pública (anon key)

export const supabase = createClient(supabaseUrl, supabaseKey);
