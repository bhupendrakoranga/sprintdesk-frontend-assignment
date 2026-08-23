import type {
  ApiErrorResponse,
  AuthUser,
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
} from "../types/global";
import { env } from "../config/env";

const handleApiError = async (response: Response): Promise<never> => {
  let message = "Something went wrong. Please try again.";
  try {
    const errorData: ApiErrorResponse = await response.json();

    if (errorData.message) {
      message = errorData.message;
    }
  } catch {
  }

  throw new Error(message);
};

const request = async <T>(url: string, init: RequestInit): Promise<T> => {
  const response = await fetch(url, init);

  if (!response.ok) {
    await handleApiError(response);
  }

  return (await response.json()) as T;
};

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  return request<LoginResponse>(`${env.authBaseUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshTokenResponse> {
  return request<RefreshTokenResponse>(`${env.authBaseUrl}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
  });
}

export async function getCurrentUser(accessToken: string): Promise<AuthUser> {
  return request<AuthUser>(`${env.authBaseUrl}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
