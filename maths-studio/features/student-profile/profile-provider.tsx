"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { StudentProfile } from "@/lib/domain/student/types";
import { DEFAULT_STUDENT_PROFILE } from "@/lib/domain/student/types";

interface ProfileContextValue {
  profile: StudentProfile;
  updateProfile: (updater: (current: StudentProfile) => StudentProfile) => void;
  refreshProfile: () => Promise<void>;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

const STORAGE_KEY = "mindspark-profile-v1";

function readLocalProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STUDENT_PROFILE };
    return { ...DEFAULT_STUDENT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STUDENT_PROFILE };
  }
}

export function StudentProfileProvider({ children, initialProfile }: { children: ReactNode; initialProfile?: StudentProfile | null }) {
  const [profile, setProfile] = useState<StudentProfile>(initialProfile ?? DEFAULT_STUDENT_PROFILE);
  const [loading, setLoading] = useState(!initialProfile);

  useEffect(() => {
    if (!initialProfile) {
      setProfile(readLocalProfile());
    }
    setLoading(false);
  }, [initialProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  async function refreshProfile() {
    try {
      const res = await fetch("/api/v1/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile({ ...DEFAULT_STUDENT_PROFILE, ...data });
      }
    } catch {
      setProfile(readLocalProfile());
    }
  }

  function updateProfile(updater: (current: StudentProfile) => StudentProfile) {
    setProfile((current) => updater(current));
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, refreshProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useStudentProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useStudentProfile must be used within StudentProfileProvider");
  return ctx;
}
