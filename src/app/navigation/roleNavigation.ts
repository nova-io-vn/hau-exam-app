export type MobileRole = 'SYSTEM_ADMIN' | 'SUBJECT_ADMIN' | 'USER';

export type MobileTabName = 'index' | 'questions' | 'ai' | 'documents' | 'messages' | 'notifications' | 'more';

export const tabsByRole: Record<MobileRole, readonly MobileTabName[]> = {
  SYSTEM_ADMIN: ['index', 'questions', 'messages', 'notifications', 'more'],
  SUBJECT_ADMIN: ['index', 'questions', 'messages', 'notifications', 'more'],
  USER: ['index', 'questions', 'ai', 'messages', 'more'],
};

export const tabLabelsByRole: Record<MobileRole, Partial<Record<MobileTabName, string>>> = {
  SYSTEM_ADMIN: { index: 'Tổng quan', questions: 'Giảng viên', messages: 'Tin nhắn', notifications: 'Thông báo', more: 'Thêm' },
  SUBJECT_ADMIN: { index: 'Tổng quan', questions: 'Chờ duyệt', messages: 'Tin nhắn', notifications: 'Thông báo', more: 'Thêm' },
  USER: { index: 'Tổng quan', questions: 'Câu hỏi', ai: 'Kute', messages: 'Tin nhắn', more: 'Thêm' },
};
