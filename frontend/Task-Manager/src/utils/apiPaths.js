export const BASE_URL = "http://localhost:8000";

// utils/apiPaths.js
export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register", // Register a new user (Admin or Member)
    LOGIN: "/api/auth/login", // Authenticate user & return JWT token
    GET_PROFILE: "/api/auth/profile", // Get logged-in user details
    UPDATE_PROFILE: "/api/auth/profile",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
    VERIFY_EMAIL: "/api/auth/verify-email",
    RESEND_VERIFICATION: "/api/auth/resend-verification",
    REFRESH_TOKEN: "/api/auth/refresh-token",
    LOGOUT: "/api/auth/logout",
  },

  USERS: {
    GET_ALL_USERS: "/api/users", // Get all users (Admin only)
    SEARCH_USERS: "/api/users/search", // Search users (Authenticated users)
    GET_COMPANIES: "/api/users/companies", // Get company names for autocomplete (Authenticated users)
    GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Get user by ID
    CREATE_USER: "/api/users", // Create a new user (Admin only)
    UPDATE_USER: (userId) => `/api/users/${userId}`, // Update user details
    DELETE_USER: (userId) => `/api/users/${userId}`, // Delete a user
    GET_DELETED_USERS: "/api/users/deleted", // Get deleted users (Admin only)
    CLEANUP_DELETED_USERS: "/api/users/cleanup-deleted", // Clean up orphaned deleted users (Admin only)
    DEBUG_USERS: "/api/users/debug", // Debug: Get all users (Authenticated users)
    SEED_USERS: "/api/users/seed", // Seed test users (Admin only)
  },

  CLIENTS: {
    GET_ALL_CLIENTS: "/api/clients", // Get all clients (Admin only)
    GET_CLIENT_BY_ID: (clientId) => `/api/clients/${clientId}`, // Get client by ID
    CREATE_CLIENT: "/api/clients", // Create a new client (Admin only)
    UPDATE_CLIENT: (clientId) => `/api/clients/${clientId}`, // Update client details
    DELETE_CLIENT: (clientId) => `/api/clients/${clientId}`, // Delete a client
  },

  TASKS: {
    GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Get Dashboard Data
    GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Get User Dashboard Data
    GET_ALL_TASKS: "/api/tasks", // Get all tasks (Admin: all, User: only assigned tasks)
    GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Get task by ID
    CREATE_TASK: "/api/tasks", // Create a new task (Admin only)
    UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Update task details
    DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Delete a task (Admin only)

    UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Update task status
    UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Update todo checklist
  },

  REPORTS: {
    EXPORT_TASKS: "/api/reports/export/tasks", // Download all tasks as an Excel/PDF report
    EXPORT_USERS: "/api/reports/export/users", // Download user-task report
  },

  IMAGE: {
    UPLOAD_IMAGE: "/api/auth/upload-image",
  },

  DASHBOARD: {
    PATRIMOINE_OVERVIEW: "/api/dashboard/patrimoine-overview",
    PENDING_TASKS: "/api/dashboard/pending-tasks",
    RECENT_DISCUSSIONS: "/api/dashboard/recent-discussions-documents",
    STATS: "/api/dashboard/stats",
    ADMIN_STATS: "/api/dashboard/admin/stats",
  },

  TEAMS: {
    GET_ALL_TEAMS: "/api/teams",
    GET_TEAM_BY_ID: (teamId) => `/api/teams/${teamId}`,
    CREATE_TEAM: "/api/teams",
    UPDATE_TEAM: (teamId) => `/api/teams/${teamId}`,
    DELETE_TEAM: (teamId) => `/api/teams/${teamId}`,
    ADD_MEMBER: (teamId) => `/api/teams/${teamId}/members`,
    REMOVE_MEMBER: (teamId, userId) => `/api/teams/${teamId}/members/${userId}`,
  },

  PROJECTS: {
    GET_ALL_PROJECTS: "/api/projects",
    GET_ARCHIVED_PROJECTS: "/api/projects/archived",
    GET_PROJECT_BY_ID: (projectId) => `/api/projects/${projectId}`,
    GET_PROJECT_DETAILS: "/api/projects/:id",
    CREATE_PROJECT: "/api/projects",
    UPDATE_PROJECT: (projectId) => `/api/projects/${projectId}`,
    RESTORE_PROJECT: (projectId) => `/api/projects/${projectId}/restore`,
    DELETE_PROJECT: (projectId) => `/api/projects/${projectId}`,
    GET_STATS: "/api/projects/stats",
  },

  INVOICES: {
    GET_ALL_INVOICES: "/api/invoices",
    GET_INVOICE_BY_ID: (invoiceId) => `/api/invoices/${invoiceId}`,
    CREATE_INVOICE: "/api/invoices",
    UPDATE_INVOICE: (invoiceId) => `/api/invoices/${invoiceId}`,
    DELETE_INVOICE: (invoiceId) => `/api/invoices/${invoiceId}`,
    GET_STATS: "/api/invoices/stats",
  },

  DOCUMENTS: {
    GET_ALL_DOCUMENTS: "/api/documents",
    GET_ARCHIVED_DOCUMENTS: "/api/documents/archived",
    GET_DOCUMENT_BY_ID: (documentId) => `/api/documents/${documentId}`,
    UPLOAD_DOCUMENT: "/api/documents",
    UPDATE_DOCUMENT: (documentId) => `/api/documents/${documentId}`,
    DELETE_DOCUMENT: (documentId) => `/api/documents/${documentId}`,
    RESTORE_DOCUMENT: (documentId) => `/api/documents/${documentId}/restore`,
    DOWNLOAD_DOCUMENT: (documentId) => `/api/documents/${documentId}/download`,
  },
  WEEKLY_UPDATES: {
    GET_ALL: "/api/weekly-updates",
    GET_BY_PROJECT: (projectId) => `/api/weekly-updates/project/${projectId}`,
    CREATE_UPDATE: "/api/weekly-updates",
    UPDATE_UPDATE: (updateId) => `/api/weekly-updates/${updateId}`,
    DELETE_UPDATE: (updateId) => `/api/weekly-updates/${updateId}`,
  },
  MILESTONES: {
    GET_ALL: "/api/milestones",
    GET_BY_PROJECT: (projectId) => `/api/milestones/project/${projectId}`,
    CREATE_MILESTONE: "/api/milestones",
    UPDATE_MILESTONE: (milestoneId) => `/api/milestones/${milestoneId}`,
    DELETE_MILESTONE: (milestoneId) => `/api/milestones/${milestoneId}`,
  },
  MESSAGES: {
    GET_ALL_MESSAGES: "/api/messages",
    GET_PROJECT_MESSAGES: (projectId) => `/api/messages/project/${projectId}`,
    SEND_MESSAGE: "/api/messages",
    MARK_AS_READ: (messageId) => `/api/messages/${messageId}/read`,
    MARK_ALL_AS_READ: "/api/messages/read/all",
    DELETE_MESSAGE: (messageId) => `/api/messages/${messageId}`,
    GET_UNREAD_COUNT: "/api/messages/unread/count",
    GET_RECENT_MESSAGES: "/api/messages/recent",
  },
  CHAT: {
    GET_CONVERSATIONS: "/api/chat/conversations",
    CREATE_CONVERSATION: "/api/chat/conversations",
    GET_CONVERSATION_MESSAGES: (conversationId) => `/api/chat/conversations/${conversationId}/messages`,
    SEND_MESSAGE: "/api/chat/messages",
    ADD_PARTICIPANT: "/api/chat/conversations/participants",
    REMOVE_PARTICIPANT: "/api/chat/conversations/participants",
  },
};
