const API_BASE_URL = __DEV__
  ? "http://10.1.10.81:8000"
  : "https://your-deployed-api.com";

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

export interface MessageResponse extends MessagePayload {
  id: number;
  user_id: number;
  created_at: string;
  updated_at?: string | null;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
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

export async function getHelloMessage(): Promise<
  ApiResponse<{ message: string }>
> {
  return apiRequest<{ message: string }>("/api/hello");
}
