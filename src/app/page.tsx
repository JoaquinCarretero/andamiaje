export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-primary">
          Andamiaje Centro de Rehabilitación
        </h1>
        <p className="text-muted-foreground max-w-md">
          Sistema de gestión para terapeutas y acompañantes
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/login" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Iniciar Sesión
          </a>
          <a 
            href="/terapeuta" 
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Demo Terapeuta
          </a>
          <a 
            href="/acompanante" 
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Demo Acompañante
          </a>
        </div>
      </div>
    </div>
  )
}
