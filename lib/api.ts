const API_BASE_URL = __DEV__
  ? "http://10.1.10.81:8000"
  : "https://your-deployed-api.com";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
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

export async function getHelloMessage(): Promise<
  ApiResponse<{ message: string }>
> {
  return apiRequest<{ message: string }>("/api/hello");
}
