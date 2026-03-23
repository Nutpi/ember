"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  nickname: string;
  partner_id: string | null;
  partner_nickname: string | null;
  invite_code: string;
}

interface AuthContextType {
  user: { id: string } | null;
  profile: Profile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("nickname, partner_id, invite_code")
      .eq("id", userId)
      .single();

    if (!data) {
      setProfile(null);
      return;
    }

    let partnerNickname: string | null = null;
    if (data.partner_id) {
      const { data: partner } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", data.partner_id)
        .single();
      if (partner) partnerNickname = partner.nickname;
    }

    setProfile({
      nickname: data.nickname,
      partner_id: data.partner_id,
      partner_nickname: partnerNickname,
      invite_code: data.invite_code,
    });
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: u } }) => {
      if (u) {
        setUser({ id: u.id });
        fetchProfile(u.id).then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const value = useMemo(
    () => ({ user, profile, loading, refreshProfile }),
    [user, profile, loading, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
