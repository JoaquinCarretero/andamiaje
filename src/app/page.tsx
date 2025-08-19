import { redirect } from "next/navigation"

export default function Home() {
  // Por ahora redirigimos a la página de autenticación
  // En producción, aquí verificaríamos si el usuario está autenticado
  redirect("/auth")
}
