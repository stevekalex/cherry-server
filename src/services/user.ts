// eslint-disable-next-line @typescript-eslint/no-extraneous-class

import { GoogleUser } from "./auth";

interface User {
    id?: string;
    googleId?: string;
    email: string;
    name: string;
    profilePicture: string;
    firstName: string;
    lastName: string;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class UserService {
  static async findOrCreateUser(googleUser: GoogleUser) {
    let user = await findUserByGoogleId(googleUser.id);

    if (!user) {
        // Create new user
        user = await createUser({
            googleId: googleUser.id,
            email: googleUser.email,
            name: googleUser.name,
            profilePicture: googleUser.picture ?? '',
            firstName: googleUser.given_name ?? '',
            lastName: googleUser.family_name ?? '',
        });
      } else {
        // Update existing user info
       user = await updateUser(user.id as string, {
          email: googleUser.email,
          name: googleUser.name,
          profilePicture: googleUser.picture ?? '',
          firstName: googleUser.given_name ?? '',
          lastName: googleUser.family_name ?? ''    
        });
      }
    }
}

export const createUser = async (user: User): Promise<User | null> => {
    console.log("🚀 ~ createUser ~ user:", user)
    
    return {
        id: '1',
        googleId: '1',
        email: 'test@test.com',
        name: 'Test User',
        profilePicture: 'https://example.com/profile.jpg',
        firstName: 'Test',
        lastName: 'User'
    }
}



export const findUserByGoogleId = async (googleId: string): Promise<User | null> => {
    console.log("🚀 ~ findUserByGoogleId ~ googleId:", googleId)
    // Randomly return either user data or null (50% chance for each)
    if (Math.random() > 0.5) {
        return {
            id: '1',
            googleId: '1',
            email: 'test@test.com',
            name: 'Test User',
            profilePicture: 'https://example.com/profile.jpg',
            firstName: 'Test',
            lastName: 'User'
        }
    } else {
        return null;
    }
}

export const updateUser = async (userId: string, user: User): Promise<User | null> => {
    console.log("🚀 ~ updateUser ~ user:", user)
    console.log("🚀 ~ updateUser ~ userId:", userId)
    return {
        id: '1',
        googleId: '1',
        email: 'test@test.com',
        name: 'Test User',
        profilePicture: 'https://example.com/profile.jpg',
        firstName: 'Test',
        lastName: 'User'
    }
}