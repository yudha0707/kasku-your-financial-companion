// Mock authentication. Replace with POST /auth/login etc. on your backend.
import { DEMO_CREDENTIALS, DEMO_USER } from "@/data/mockData";
import type { User } from "@/types";
import { uid } from "@/utils/format";
import { TOKEN_KEY, USE_MOCK, delay, request } from "./api";

const USER_KEY = "kasku:user";
const REGISTERED_KEY = "kasku:registered";

interface AuthResponse {
  token: string;
  user: User;
}

function store(res: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, res.token);
  localStorage.setItem(USER_KEY, JSON.stringify(res.user));
  return res.user;
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    if (!USE_MOCK) return store(await request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }));
    await delay(600);
    const registered = JSON.parse(localStorage.getItem(REGISTERED_KEY) ?? "[]") as { email: string; password: string; name: string }[];
    const match = registered.find((r) => r.email === email && r.password === password);
    const isDemo = email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;
    if (!isDemo && !match) throw new Error("Email atau kata sandi salah");
    const user: User = match ? { ...DEMO_USER, id: uid("usr"), name: match.name, email: match.email } : DEMO_USER;
    return store({ token: `mock_${uid("tok")}`, user });
  },

  async register(name: string, email: string, password: string): Promise<User> {
    if (!USE_MOCK) return store(await request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }));
    await delay(700);
    const registered = JSON.parse(localStorage.getItem(REGISTERED_KEY) ?? "[]") as { email: string; password: string; name: string }[];
    if (registered.some((r) => r.email === email) || email === DEMO_CREDENTIALS.email) throw new Error("Email sudah terdaftar");
    registered.push({ name, email, password });
    localStorage.setItem(REGISTERED_KEY, JSON.stringify(registered));
    return store({ token: `mock_${uid("tok")}`, user: { ...DEMO_USER, id: uid("usr"), name, email } });
  },

  async forgotPassword(email: string): Promise<void> {
    if (!USE_MOCK) return request<void>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
    await delay(700);
  },

  async me(): Promise<User | null> {
    if (!USE_MOCK) return request<User>("/auth/me").catch(() => null);
    const raw = localStorage.getItem(USER_KEY);
    return raw && localStorage.getItem(TOKEN_KEY) ? (JSON.parse(raw) as User) : null;
  },

  async updateProfile(data: Pick<User, "name" | "email" | "phone">): Promise<User> {
    if (!USE_MOCK) return request<User>("/auth/profile", { method: "PUT", body: JSON.stringify(data) });
    await delay();
    const current = (await this.me()) ?? DEMO_USER;
    const user = { ...current, ...data };
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    if (!USE_MOCK) await request<void>("/auth/logout", { method: "POST" }).catch(() => undefined);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
