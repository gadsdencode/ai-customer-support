
import { createClient } from '@/app/utils/supabase/server'

export default async function SupaDemo() {
    const supabase = await createClient();
    const { data: countries } = await supabase.from("countries").select();

    return <pre className='text-white'>{JSON.stringify(countries, null, 2)}</pre>
  }