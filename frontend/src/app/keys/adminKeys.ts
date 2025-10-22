export const adminApi = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005") + "/admin"
export const adminWsApi = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:3003"