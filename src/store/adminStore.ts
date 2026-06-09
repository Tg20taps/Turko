import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';

type AdminUser = {
  email: string;
  name: string;
  role: 'owner' | 'staff';
};

type AdminState = {
  user: AdminUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        if (!email || password.length < 4) {
          set({ isLoading: false, error: 'Ingresa un correo y una clave valida.' });
          return false;
        }

        if (isSupabaseConfigured && supabase) {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) {
            set({ isLoading: false, error: error.message });
            return false;
          }
        }

        set({
          user: {
            email,
            name: email.includes('rodrigo') ? 'Rodrigo El Turko' : 'Encargado Rikki-Tikki',
            role: email.includes('rodrigo') ? 'owner' : 'staff',
          },
          isLoading: false,
        });
        return true;
      },
      logout: async () => {
        if (isSupabaseConfigured && supabase) {
          await supabase.auth.signOut();
        }
        set({ user: null });
      },
    }),
    {
      name: 'rikki-tikki-admin',
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
