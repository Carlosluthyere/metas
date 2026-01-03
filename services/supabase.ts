
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wbqxobdzmbukwjvoavzm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_M8caStuftxPeO0thW_vKUQ_0bImc8Ds';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
