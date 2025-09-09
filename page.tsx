"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MXBikesPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showRaceRegistration, setShowRaceRegistration] = useState(false)
  const [showClassifications, setShowClassifications] = useState(false)
  const [showRegisteredList, setShowRegisteredList] = useState(false)
  const [selectedRaceType, setSelectedRaceType] = useState("")
  const [user, setUser] = useState<{ name: string; email: string; guid: string; isAdmin: boolean } | null>(null)
  const [registrationsOpen, setRegistrationsOpen] = useState(true)

  const [classifications] = useState([
    { position: 1, name: "Carlos Martín", autonomy: "Madrid", points: 150 },
    { position: 2, name: "Miguel Rodríguez", autonomy: "Cataluña", points: 142 },
    { position: 3, name: "Alejandro García", autonomy: "Andalucía", points: 138 },
  ])

  const [registeredUsers] = useState([
    { name: "Carlos Martín", autonomy: "Madrid", category: "MXGP", guid: "FF0110000145ADF1" },
    { name: "Miguel Rodríguez", autonomy: "Cataluña", category: "MX2", guid: "FF0110000145ADF2" },
    { name: "Alejandro García", autonomy: "Andalucía", category: "MX125", guid: "FF0110000145ADF3" },
  ])

  const handleLogin = (email: string, password: string) => {
    // Check if user is admin (simple check for demo - in real app would be from database)
    const isAdmin = email === "admin@mxbikes.es"

    setUser({
      name: isAdmin ? "Administrador" : "Piloto MX",
      email: email,
      guid: "FF" + Math.random().toString(16).substr(2, 14).toUpperCase(),
      isAdmin: isAdmin,
    })
    setIsLoggedIn(true)
    setShowLogin(false)
  }

  const handleRegister = (name: string, email: string, password: string) => {
    const guid = "FF" + Math.random().toString(16).substr(2, 14).toUpperCase()
    setUser({
      name: name,
      email: email,
      guid: guid,
      isAdmin: false,
    })
    setIsLoggedIn(true)
    setShowRegister(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setShowRaceRegistration(false)
    setShowClassifications(false)
    setShowRegisteredList(false)
  }

  if (showLogin) {
    return (
      <LoginForm
        onLogin={handleLogin}
        onBack={() => setShowLogin(false)}
        onRegister={() => {
          setShowLogin(false)
          setShowRegister(true)
        }}
      />
    )
  }

  if (showRegister) {
    return <RegisterForm onRegister={handleRegister} onBack={() => setShowRegister(false)} />
  }

  if (showRaceRegistration) {
    return (
      <RaceRegistrationForm
        selectedRaceType={selectedRaceType}
        onBack={() => setShowRaceRegistration(false)}
        user={user}
        registrationsOpen={registrationsOpen}
      />
    )
  }

  if (showClassifications) {
    return (
      <ClassificationsView
        classifications={classifications}
        onBack={() => setShowClassifications(false)}
        isAdmin={user?.isAdmin || false}
      />
    )
  }

  if (showRegisteredList) {
    return (
      <RegisteredListView
        registeredUsers={registeredUsers}
        onBack={() => setShowRegisteredList(false)}
        isAdmin={user?.isAdmin || false}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground py-4 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
        <div className="max-w-6xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-primary font-bold text-xl">🏍️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Comunidad Española MXBikes</h1>
              <p className="text-sm opacity-90">Plataforma de Inscripción a Carreras</p>
            </div>
          </div>
          <nav className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm">Hola, {user?.name}</span>
                {user?.isAdmin && (
                  <Badge variant="destructive" className="text-xs">
                    ADMIN
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {user?.guid}
                </Badge>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm" onClick={() => setShowLogin(true)}>
                  Iniciar Sesión
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/20 hover:bg-white/20"
                  onClick={() => setShowRegister(true)}
                >
                  Crear Cuenta
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {user?.isAdmin && (
        <section className="py-4 px-6 bg-destructive/10 border-b">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-destructive">Panel de Administración</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="registrations-toggle" className="text-sm">
                    Inscripciones {registrationsOpen ? "Abiertas" : "Cerradas"}
                  </Label>
                  <Switch
                    id="registrations-toggle"
                    checked={registrationsOpen}
                    onCheckedChange={setRegistrationsOpen}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-primary text-primary-foreground">🏁 Temporada 2025</Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            ¡Únete a la <span className="text-primary">Carrera!</span>
          </h2>
          <p className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
            Inscríbete en los campeonatos de motocross más emocionantes de España. Compite con los mejores pilotos del
            país.
          </p>
          {!registrationsOpen && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive font-semibold">⚠️ Las inscripciones están cerradas temporalmente</p>
            </div>
          )}
          {isLoggedIn ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8"
                onClick={() => setShowRaceRegistration(true)}
                disabled={!registrationsOpen}
              >
                Inscribirse a Carreras
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-transparent"
                onClick={() => setShowClassifications(true)}
              >
                Ver Clasificaciones
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-transparent"
                onClick={() => setShowRegisteredList(true)}
              >
                Lista de Inscritos
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8" onClick={() => setShowRegister(true)}>
                Crear Cuenta
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-transparent"
                onClick={() => setShowLogin(true)}
              >
                Iniciar Sesión
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-transparent"
                onClick={() => setShowClassifications(true)}
              >
                Ver Clasificaciones
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-transparent"
                onClick={() => setShowRegisteredList(true)}
              >
                Lista de Inscritos
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Categorías de Carreras</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Elige tu categoría y demuestra tu habilidad en las pistas más desafiantes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <RaceCard
              title="Campeonato de España"
              description="La competición más prestigiosa del país"
              icon="🏆"
              onClick={() => {
                setSelectedRaceType("Campeonato de España")
                setShowRaceRegistration(true)
              }}
              disabled={!isLoggedIn || !registrationsOpen}
            />
            <RaceCard
              title="MX Autonomías"
              description="Competiciones regionales por comunidades"
              icon="🌍"
              onClick={() => {
                setSelectedRaceType("MX Autonomías")
                setShowRaceRegistration(true)
              }}
              disabled={!isLoggedIn || !registrationsOpen}
            />
            <RaceCard
              title="SX (Supercross)"
              description="Adrenalina pura en circuitos cerrados"
              icon="⚡"
              onClick={() => {
                setSelectedRaceType("SX (Supercross)")
                setShowRaceRegistration(true)
              }}
              disabled={!isLoggedIn || !registrationsOpen}
            />
            <RaceCard
              title="Funrace"
              description="Carreras divertidas para todos los niveles"
              icon="🎉"
              onClick={() => {
                setSelectedRaceType("Funrace")
                setShowRaceRegistration(true)
              }}
              disabled={!isLoggedIn || !registrationsOpen}
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-card-foreground mb-6">Comunidad Española MXBikes</h3>
          <p className="text-muted-foreground text-lg mb-8">
            Más de 5,000 pilotos ya forman parte de nuestra comunidad. Únete y vive la pasión del motocross.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <p className="text-muted-foreground">Carreras al año</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
              <p className="text-muted-foreground">Pilotos registrados</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">25</div>
              <p className="text-muted-foreground">Circuitos oficiales</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-2xl">🏍️</span>
            <span className="font-bold text-lg">Comunidad Española MXBikes</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2025 Comunidad Española MXBikes. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

function LoginForm({
  onLogin,
  onBack,
  onRegister,
}: { onLogin: (email: string, password: string) => void; onBack: () => void; onRegister: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
          <CardDescription>Accede a tu cuenta de MXBikes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button className="w-full" onClick={() => onLogin(email, password)}>
            Iniciar Sesión
          </Button>
          <Button variant="outline" className="w-full bg-transparent" onClick={() => onLogin(email, password)}>
            🔗 Continuar con Gmail
          </Button>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <button className="text-primary hover:underline" onClick={onRegister}>
                Crear cuenta
              </button>
            </p>
            <button className="text-sm text-muted-foreground hover:underline" onClick={onBack}>
              ← Volver al inicio
            </button>
          </div>
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
            <strong>Para acceso de administrador:</strong>
            <br />
            Email: admin@mxbikes.es
            <br />
            <em>Cualquier contraseña</em>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RegisterForm({
  onRegister,
  onBack,
}: { onRegister: (name: string, email: string, password: string) => void; onBack: () => void }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Crear Cuenta</CardTitle>
          <CardDescription>Únete a la Comunidad Española MXBikes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del Piloto</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
            <strong>Tu GUID será:</strong> FF0110000145ADF169 (ejemplo)
            <br />
            <em>Se generará automáticamente al crear tu cuenta</em>
          </div>
          <Button className="w-full" onClick={() => onRegister(name, email, password)}>
            Crear Cuenta
          </Button>
          <Button variant="outline" className="w-full bg-transparent" onClick={() => onRegister(name, email, password)}>
            🔗 Registrarse con Gmail
          </Button>
          <div className="text-center">
            <button className="text-sm text-muted-foreground hover:underline" onClick={onBack}>
              ← Volver al inicio
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function RaceRegistrationForm({
  selectedRaceType,
  onBack,
  user,
  registrationsOpen,
}: { selectedRaceType: string; onBack: () => void; user: any; registrationsOpen: boolean }) {
  const [bikeCategory, setBikeCategory] = useState("")
  const [dorsalNumber, setDorsalNumber] = useState("")
  const [autonomy, setAutonomy] = useState("")
  const [equipmentFile, setEquipmentFile] = useState<File | null>(null)

  const handleSubmit = () => {
    if (selectedRaceType === "MX Autonomías") {
      alert(
        `¡Inscripción completada!\nCarrera: ${selectedRaceType}\nCategoría: ${bikeCategory}\nAutonomía: ${autonomy}`,
      )
    } else {
      alert(`¡Inscripción completada!\nCarrera: ${selectedRaceType}\nCategoría: ${bikeCategory}`)
    }
    onBack()
  }

  if (!registrationsOpen) {
    return (
      <div className="min-h-screen bg-background px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Inscripciones Cerradas</CardTitle>
              <CardDescription className="text-center">
                Las inscripciones están temporalmente cerradas por los administradores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={onBack} className="w-full bg-transparent">
                ← Volver al inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const autonomias = [
    "Andalucía",
    "Aragón",
    "Asturias",
    "Baleares",
    "Canarias",
    "Cantabria",
    "Castilla-La Mancha",
    "Castilla y León",
    "Cataluña",
    "Comunidad Valenciana",
    "Extremadura",
    "Galicia",
    "La Rioja",
    "Madrid",
    "Murcia",
    "Navarra",
    "País Vasco",
  ]

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Inscripción a Carrera</CardTitle>
            <CardDescription>
              Inscribiéndote en: <strong>{selectedRaceType}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Datos del Piloto</h4>
              <p>
                <strong>Nombre:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email}
              </p>
              <p>
                <strong>GUID:</strong> {user?.guid}
              </p>
            </div>

            <div>
              <Label htmlFor="bike-category">Categoría de Moto</Label>
              <Select value={bikeCategory} onValueChange={setBikeCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mx85">MX 85</SelectItem>
                  <SelectItem value="mx125">MX 125</SelectItem>
                  <SelectItem value="mx2">MX2</SelectItem>
                  <SelectItem value="mxgp">MXGP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedRaceType === "MX Autonomías" && (
              <div>
                <Label htmlFor="autonomy">Autonomía de España</Label>
                <Select value={autonomy} onValueChange={setAutonomy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu autonomía" />
                  </SelectTrigger>
                  <SelectContent>
                    {autonomias.map((auto) => (
                      <SelectItem key={auto} value={auto}>
                        {auto}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label htmlFor="equipment">Equipación</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="equipment"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setEquipmentFile(e.target.files?.[0] || null)}
                />
                <label htmlFor="equipment" className="cursor-pointer">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-muted-foreground">
                    {equipmentFile ? equipmentFile.name : "Desliza aquí tu equipación"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Formatos: JPG, PNG, PDF</p>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
                ← Volver
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={!bikeCategory || (selectedRaceType === "MX Autonomías" && !autonomy)}
              >
                Completar Inscripción
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ClassificationsView({
  classifications,
  onBack,
  isAdmin,
}: { classifications: any[]; onBack: () => void; isAdmin: boolean }) {
  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Clasificaciones</CardTitle>
            <CardDescription>
              Tabla de clasificaciones actual del campeonato
              {isAdmin && (
                <Badge variant="destructive" className="ml-2">
                  Modo Admin
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posición</TableHead>
                  <TableHead>Piloto</TableHead>
                  <TableHead>Autonomía</TableHead>
                  <TableHead>Puntos</TableHead>
                  {isAdmin && <TableHead>Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {classifications.map((rider) => (
                  <TableRow key={rider.position}>
                    <TableCell className="font-medium">#{rider.position}</TableCell>
                    <TableCell>{rider.name}</TableCell>
                    <TableCell>{rider.autonomy}</TableCell>
                    <TableCell>{rider.points}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-6">
              <Button variant="outline" onClick={onBack}>
                ← Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function RegisteredListView({
  registeredUsers,
  onBack,
  isAdmin,
}: { registeredUsers: any[]; onBack: () => void; isAdmin: boolean }) {
  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Lista de Inscritos</CardTitle>
            <CardDescription>
              Pilotos registrados en las competiciones
              {isAdmin && (
                <Badge variant="destructive" className="ml-2">
                  Modo Admin
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Piloto</TableHead>
                  <TableHead>Autonomía</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>GUID</TableHead>
                  {isAdmin && <TableHead>Acciones</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {registeredUsers.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.autonomy}</TableCell>
                    <TableCell>{user.category}</TableCell>
                    <TableCell className="font-mono text-sm">{user.guid}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Editar
                          </Button>
                          <Button variant="destructive" size="sm">
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-6">
              <Button variant="outline" onClick={onBack}>
                ← Volver al inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function RaceCard({
  title,
  description,
  icon,
  onClick,
  disabled,
}: { title: string; description: string; icon: string; onClick: () => void; disabled: boolean }) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
      onClick={disabled ? undefined : onClick}
    >
      <CardHeader className="text-center">
        <div className="text-4xl mb-2">{icon}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full" disabled={disabled}>
          {disabled ? "Inscripciones cerradas" : "Inscribirse"}
        </Button>
      </CardContent>
    </Card>
  )
}
