import { authStore } from '@/src/stores/authStore';
import { getRefreshToken, request } from '@/src/services/api/client';
import type { Session } from '@/src/types/api';
import { profileApi } from '@/src/features/profile/api/profileApi';

let bootstrapPromise: Promise<Session | null> | null = null;

export function bootstrapAuth() {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      try {
        const token = await getRefreshToken();
        if (!token) return null;
        const session = await request<Session>('/api/v1/auth/refresh', { method: 'POST', body: { refreshToken: token }, skipRefresh: true });
        await authStore.set(session);
        try { authStore.updateProfile(await profileApi.getMe()); } catch { /* Session remains usable when profile enrichment is temporarily unavailable. */ }
        return authStore.get();
      } catch { await authStore.clear(); return null; }
    })().finally(() => { bootstrapPromise = null; });
  }
  return bootstrapPromise;
}
