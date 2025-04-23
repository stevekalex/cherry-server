// eslint-disable-next-line @typescript-eslint/no-extraneous-class

import supabase from "../db/db";
import { GoogleUser } from "./auth";

interface User {
    id?: string;
    google_id?: string;
    email: string;
    name: string;
    profile_picture: string;
    first_name: string;
    last_name: string;
    access_token?: string;
    refresh_token?: string;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class UserService {
  static async findOrCreateUser(googleUser: GoogleUser) {
    let user = await findUserByGoogleId(googleUser.id);

    if (!user) {
        // Create new user
        user = await createUser({
            google_id: googleUser.id,
            email: googleUser.email,
            name: googleUser.name,
            profile_picture: googleUser.picture ?? '',
            first_name: googleUser.given_name ?? '',
            last_name: googleUser.family_name ?? '',
            access_token: googleUser.access_token ?? '',
            refresh_token: googleUser.refresh_token ?? '',
        });
      } else {
        // Update existing user info
       user = await updateUser(user.id as string, {
          email: googleUser.email,
          name: googleUser.name,
          profile_picture: googleUser.picture ?? '',
          first_name: googleUser.given_name ?? '',
          last_name: googleUser.family_name ?? '',
          access_token: googleUser.access_token ?? '',
          refresh_token: googleUser.refresh_token ?? '',
        });
      }
    }
}

export const createUser = async (user: User): Promise<User | null> => {
    const { data: created, error } = await supabase
        .from('users')
        .insert({
            email: user.email,
            profile_picture: user.profile_picture,
            first_name: user.first_name,
            last_name: user.last_name,
            google_id: user.google_id,
            access_token: user.access_token,
            refresh_token: user.refresh_token,
        })
        .single();
    if (error) {
        throw error
    }

    return created;
}


export const findUserByGoogleId = async (googleId: string): Promise<User | null> => {
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('google_id', googleId)
        .single();
    if (error && error.code !== 'PGRST116') /* not found */ throw error;

    return user;
}

export const updateUser = async (id: string, user: User): Promise<User | null> => {
    const { data: updated, error } = await supabase
        .from('users')
        .update(user)
        .eq('id', id)
        .single();
    if (error) throw error;
    return updated;
}

export async function deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    if (error) throw error;
}