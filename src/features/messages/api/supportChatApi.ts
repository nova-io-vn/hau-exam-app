import { api } from '@/src/services/api';

export type ChatContact = {
  userId: string;
  fullName?: string;
  displayName?: string;
  lecturerCode?: string;
  avatarUrl?: string | null;
  role: 'SYSTEM_ADMIN' | 'SUBJECT_ADMIN' | 'USER';
  facultyId?: string | null;
};

export type ChatAttachment = {
  id: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  url: string;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: string;
  content?: string | null;
  createdAt: string;
  deleted?: boolean;
  deletedAt?: string | null;
  attachments?: ChatAttachment[];
};

export type ChatConversation = {
  id: string;
  createdByUserId: string;
  assignedAdminId?: string | null;
  createdByRole: string;
  facultyId?: string | null;
  subject: string;
  status: string;
  lastMessage?: string;
  lastMessageAt: string;
  unreadCount?: number;
};

type Page<T> = { content: T[] };
export type PickedImage = { uri: string; name: string; mimeType: string };

const base = '/api/v1/support/conversations';
const pageQuery = (size = 50) => `page=0&size=${size}`;

export const supportChatApi = {
  contacts: (keyword = '', role = '', facultyId = '') => {
    const query = new URLSearchParams();
    if (keyword.trim()) query.set('keyword', keyword.trim());
    if (role) query.set('role', role);
    if (facultyId) query.set('facultyId', facultyId);
    return api.get<ChatContact[]>(`/api/v1/users/me/chat-contacts?${query}`);
  },
  mine: () => api.get<Page<ChatConversation>>(`${base}/my?${pageQuery()}`),
  assigned: () => api.get<Page<ChatConversation>>(`${base}/assigned?${pageQuery()}`),
  admin: () => api.get<Page<ChatConversation>>(`/api/v1/admin/support/conversations?${pageQuery()}`),
  messages: (conversationId: string) => api.get<Page<ChatMessage>>(`${base}/${conversationId}/messages?${pageQuery(100)}`),
  create: (recipientUserId: string, subject: string) => api.post<ChatConversation>(base, { recipientUserId, subject, content: '' }),
  read: (conversationId: string) => api.patch<number>(`${base}/${conversationId}/read`),
  send: (conversationId: string, content: string, image?: PickedImage | null) => {
    const form = new FormData();
    if (content.trim()) form.append('content', content.trim());
    if (image) form.append('file', { uri: image.uri, name: image.name, type: image.mimeType } as unknown as Blob);
    return api.post<ChatMessage>(`${base}/${conversationId}/messages`, form);
  },
  broadcastCount: (group: string) => api.get<number>(`/api/v1/support/broadcast/count?group=${encodeURIComponent(group)}`),
  broadcast: (group: string, content: string, image?: PickedImage | null) => { const form = new FormData(); form.append('group', group); if (content.trim()) form.append('content', content.trim()); if (image) form.append('file', { uri: image.uri, name: image.name, type: image.mimeType } as unknown as Blob); return api.post<{ deliveredCount: number }>('/api/v1/support/broadcast', form); },
};

export function mergeMessages(current: ChatMessage[], incoming: ChatMessage) {
  const index = current.findIndex(item => item.id === incoming.id);
  if (index < 0) return [...current, incoming].sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
  return current.map((item, itemIndex) => itemIndex === index ? { ...item, ...incoming } : item);
}
