import { api } from '@/src/services/api';
import type { CatalogItem } from '@/src/features/questions/api/questionApi';
export type Assignment = { id: string; subjectId: string; chapterId?: string | null; topicId?: string | null; knowledgeItemId?: string | null; lecturerId: string; assignedBy: string; requiredQuestionCount: number; requiredEasy: number; requiredMedium: number; requiredHard: number; deadline: string; note?: string | null; status: string; progress: { total: number; submitted: number; approved: number; easyApproved: number; mediumApproved: number; hardApproved: number } };
export type DirectoryUser = { userId: string; fullName: string; lecturerCode?: string; avatarUrl?: string | null };
export const assignmentApi = {
  list: () => api.get<Assignment[]>('/api/v1/question-assignments'),
  subjects: () => api.get<CatalogItem[]>('/api/v1/subjects'),
  directory: (ids: string[]) => api.get<DirectoryUser[]>(`/api/v1/users/me/directory?${ids.map(id => `ids=${encodeURIComponent(id)}`).join('&')}`),
};
