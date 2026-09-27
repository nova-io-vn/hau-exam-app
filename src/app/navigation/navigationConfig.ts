export const authRoutes = ['login', 'register', 'pending-approval', 'forgot-password', 'verify-otp', 'reset-password'] as const;
// Profile, exams and admin screens are stack/account destinations, not tabs.
export const mainRoutes = ['index', 'questions', 'ai', 'documents', 'messages', 'notifications'] as const;
export const subjectAdminRoutes = ['index', 'questions', 'ai', 'documents', 'messages', 'notifications'] as const;
