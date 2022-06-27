import { User } from '@supabase/supabase-js';

export interface AppUser extends User {
  jira_access_token: string;
}
