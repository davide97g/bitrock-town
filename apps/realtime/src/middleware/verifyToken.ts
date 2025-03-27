import { supabase } from "../config/supabase";

export async function verifyToken(token: string) {
  console.info(token);
  return supabase.auth
    .getUser(token)
    .then((response) => {
      if (response.data.user) return true;
      else return false;
    })
    .catch(() => {
      return false;
    });
}
