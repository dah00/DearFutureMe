import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "dfm_token";

const API_BASE_URL = __DEV__
  ? "http://10.0.0.14:8000"
  : "https://your-deployed-api.com";

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MessagePayload {
  title: string;
  content?: string;
  message_type?: "text" | "voice";
  scheduled_date?: string; // ISO string
}

export interface ScheduleUpdate {
  scheduled_date: string; // ISO string format
}

export interface UserResponse {
  id: number;
  email: string;
  created_at: string;
  is_active: boolean;
}

export interface MessageStatsResponse {
  total_messages: number;
  upcoming_messages: number;
  text_messages: number;
  voice_messages: number;
}

export interface MessageResponse extends MessagePayload {
  id: number;
  user_id: number;
  created_at: string;
  updated_at?: string | null;
}

export async function registerUser(payload: {
  email: string;
  password: string;
}): Promise<ApiResponse<AuthResponse>> {
  return apiRequest<AuthResponse>(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    false
  );
}

export async function loginUser(payload: {
  email: string;
  password: string;
}): Promise<ApiResponse<AuthResponse>> {
  const body = new URLSearchParams();
  body.append("username", payload.email);
  body.append("password", payload.password);

  return apiRequest<AuthResponse>(
    "/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    },
    false
  );
}

export async function getCurrentUser(): Promise<ApiResponse<UserResponse>> {
  return apiRequest<UserResponse>("/api/auth/me");
}

export const tokenStorage = {
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error reading token from storage", error);
      return null;
    }
  },
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving token to storage", error);
    }
  },
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error removing token from storage", error);
    }
  },
};

const REQUEST_TIMEOUT = 10000; // 10 seconds

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = new Headers(options.headers as HeadersInit);
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (requiresAuth) {
      const token = await tokenStorage.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        clearTimeout(timeoutId);
        return {
          success: false,
          error: "Not authenticated",
        };
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // Handle 401 Unauthorized - token expired/invalid
      if (response.status === 401 && requiresAuth) {
        await tokenStorage.removeToken();
      }
      const errorData = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));
      return {
        success: false,
        error: errorData.detail || "An error occurred",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        error: "Request timeout: Server took too long to respond",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Network error: Could not connect to server",
    };
  }
}

// List messages
export async function getMessages(): Promise<ApiResponse<MessageResponse[]>> {
  return apiRequest<MessageResponse[]>("/api/messages");
}

// Create message
export async function createMessage(
  payload: MessagePayload
): Promise<ApiResponse<MessageResponse>> {
  return apiRequest<MessageResponse>("/api/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Update message
export async function updateMessage(
  id: number,
  payload: Partial<MessagePayload>
): Promise<ApiResponse<MessageResponse>> {
  return apiRequest<MessageResponse>(`/api/messages/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// Delete message
export async function deleteMessage(id: number): Promise<ApiResponse<void>> {
  return apiRequest<void>(`/api/messages/${id}`, {
    method: "DELETE",
  });
}

// Upload voice message
export async function uploadVoiceMessage(
  file: File | Blob,
  title: string,
  scheduled_date?: string
): Promise<ApiResponse<MessageResponse>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT * 3); // Longer timeout for file uploads (30s)

  try {
    const formData = new FormData();
    formData.append("file", file as any);
    formData.append("title", title);
    if (scheduled_date) {
      formData.append("scheduled_date", scheduled_date);
    }

    const token = await tokenStorage.getToken();
    if (!token) {
      clearTimeout(timeoutId);
      return {
        success: false,
        error: "Not authenticated",
      };
    }

    const url = `${API_BASE_URL}/api/messages/upload-voice`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        await tokenStorage.removeToken();
      }
      const errorData = await response.json().catch(() => ({
        detail: `HTTP ${response.status}: ${response.statusText}`,
      }));
      return {
        success: false,
        error: errorData.detail || "Upload failed",
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      return {
        success: false,
        error: "Upload timeout: Server took too long to respond",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Network error: Could not upload file",
    };
  }
}

export async function getUpcomingMessages(): Promise<
  ApiResponse<MessageResponse[]>
> {
  return apiRequest<MessageResponse[]>("/api/messages/upcoming");
}

export async function getMessageStats(): Promise<
  ApiResponse<MessageStatsResponse>
> {
  return apiRequest<MessageStatsResponse>("/api/messages/stats");
}

export async function updateScheduleDate(
  message_id: number,
  schedule_data: ScheduleUpdate
): Promise<ApiResponse<MessageResponse>> {
  return apiRequest<MessageResponse>(`/api/messages/${message_id}/schedule`, {
    method: "PATCH",
    body: JSON.stringify(schedule_data),
  });
}
