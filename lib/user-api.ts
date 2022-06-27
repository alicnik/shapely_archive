import { AppUser } from '~/types';
import { supabase } from '~/lib';

export async function updateUserProfile(userId: string, userUpdate: Partial<AppUser>) {
  await supabase.from('profile').update(userUpdate).eq('id', userId);
}
