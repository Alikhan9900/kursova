// Видаляємо middleware - він створює проблеми з навігацією
export { default } from "next-auth/middleware"

export const config = {
  matcher: [], // Порожній matcher - middleware не буде працювати
}
