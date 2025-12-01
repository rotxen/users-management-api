# Script de prueba automática de la API
# Este script prueba todos los endpoints de la API

param(
    [string]$BaseUrl = "http://localhost:3000/api",
    [switch]$Verbose
)

# Colores
function Write-Success { param($msg) Write-Host "✓ $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "✗ $msg" -ForegroundColor Red }
function Write-Info { param($msg) Write-Host "→ $msg" -ForegroundColor Cyan }
function Write-Title { param($msg) Write-Host "`n=== $msg ===" -ForegroundColor Yellow }

# Contadores
$script:totalTests = 0
$script:passedTests = 0
$script:failedTests = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [scriptblock]$TestBlock
    )
    
    $script:totalTests++
    Write-Info "Probando: $Name"
    
    try {
        & $TestBlock
        $script:passedTests++
        Write-Success $Name
        return $true
    } catch {
        $script:failedTests++
        Write-Error "$Name - Error: $_"
        if ($Verbose) {
            Write-Host $_.Exception.Message -ForegroundColor DarkRed
        }
        return $false
    }
}

# Variables globales
$script:token = $null
$script:userId = $null
$script:testEmail = "test$(Get-Random -Maximum 99999)@example.com"

Write-Host @"

╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║         API de Gestión de Usuarios - Suite de Pruebas        ║
║                                                              ║
║  Este script ejecuta pruebas automáticas sobre todos los     ║
║  endpoints de la API para verificar su funcionamiento.       ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Magenta

Write-Info "URL Base: $BaseUrl"
Write-Info "Email de prueba: $testEmail"

# ============================================================================
# PRUEBA 1: Health Check
# ============================================================================
Write-Title "PRUEBA 1: Health Check"

Test-Endpoint "GET /api/health" {
    $response = Invoke-RestMethod -Uri "$BaseUrl/health" -Method Get
    if ($response.success -ne $true) {
        throw "Health check falló"
    }
}

# ============================================================================
# PRUEBA 2: Registro de Usuario
# ============================================================================
Write-Title "PRUEBA 2: Registro de Usuario"

Test-Endpoint "POST /api/auth/register (usuario válido)" {
    $body = @{
        firstName = "Juan"
        lastName = "Pérez"
        email = $script:testEmail
        password = "Password123"
        phone = "1234567890"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BaseUrl/auth/register" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
    
    if (-not $response.success) {
        throw "Registro falló"
    }
    
    $script:token = $response.data.token
    $script:userId = $response.data.user.id
    
    if (-not $script:token) {
        throw "No se recibió token"
    }
    
    Write-Host "  Token recibido: $($script:token.Substring(0, 20))..." -ForegroundColor DarkGray
    Write-Host "  User ID: $script:userId" -ForegroundColor DarkGray
}

Test-Endpoint "POST /api/auth/register (email duplicado - debe fallar)" {
    $body = @{
        firstName = "Test"
        lastName = "Duplicate"
        email = $script:testEmail
        password = "Password123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/auth/register" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body
        
        throw "Debería haber fallado con email duplicado"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 409) {
            # Esperado: Conflict (409)
            return
        }
        throw
    }
}

Test-Endpoint "POST /api/auth/register (contraseña débil - debe fallar)" {
    $body = @{
        firstName = "Test"
        lastName = "Weak"
        email = "test$(Get-Random)@example.com"
        password = "123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/auth/register" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body
        
        throw "Debería haber fallado con contraseña débil"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 400) {
            # Esperado: Bad Request (400)
            return
        }
        throw
    }
}

# ============================================================================
# PRUEBA 3: Login
# ============================================================================
Write-Title "PRUEBA 3: Login"

Test-Endpoint "POST /api/auth/login (credenciales válidas)" {
    $body = @{
        email = $script:testEmail
        password = "Password123"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BaseUrl/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $body
    
    if (-not $response.success) {
        throw "Login falló"
    }
    
    if ($response.data.token -ne $script:token) {
        Write-Host "  Token actualizado" -ForegroundColor DarkGray
        $script:token = $response.data.token
    }
}

Test-Endpoint "POST /api/auth/login (contraseña incorrecta - debe fallar)" {
    $body = @{
        email = $script:testEmail
        password = "WrongPassword123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/auth/login" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body
        
        throw "Debería haber fallado con contraseña incorrecta"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 401) {
            # Esperado: Unauthorized (401)
            return
        }
        throw
    }
}

Test-Endpoint "POST /api/auth/login (email no existente - debe fallar)" {
    $body = @{
        email = "noexiste@example.com"
        password = "Password123"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/auth/login" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body
        
        throw "Debería haber fallado con email no existente"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 401) {
            # Esperado: Unauthorized (401)
            return
        }
        throw
    }
}

# ============================================================================
# PRUEBA 4: Obtener Perfil
# ============================================================================
Write-Title "PRUEBA 4: Obtener Perfil"

$headers = @{
    "Authorization" = "Bearer $script:token"
}

Test-Endpoint "GET /api/users/profile (con token)" {
    $response = Invoke-RestMethod -Uri "$BaseUrl/users/profile" `
        -Method Get `
        -Headers $headers
    
    if (-not $response.success) {
        throw "No se pudo obtener perfil"
    }
    
    if ($response.data.id -ne $script:userId) {
        throw "ID de usuario no coincide"
    }
    
    Write-Host "  Nombre: $($response.data.firstName) $($response.data.lastName)" -ForegroundColor DarkGray
    Write-Host "  Email: $($response.data.email)" -ForegroundColor DarkGray
}

Test-Endpoint "GET /api/users/profile (sin token - debe fallar)" {
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/users/profile" -Method Get
        throw "Debería haber fallado sin token"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 401) {
            # Esperado: Unauthorized (401)
            return
        }
        throw
    }
}

# ============================================================================
# PRUEBA 5: Actualizar Perfil
# ============================================================================
Write-Title "PRUEBA 5: Actualizar Perfil"

Test-Endpoint "PUT /api/users/profile (actualizar nombre y teléfono)" {
    $body = @{
        firstName = "Juan Carlos"
        lastName = "Pérez García"
        phone = "9876543210"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BaseUrl/users/profile" `
        -Method Put `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $body
    
    if (-not $response.success) {
        throw "No se pudo actualizar perfil"
    }
    
    if ($response.data.firstName -ne "Juan Carlos") {
        throw "Nombre no se actualizó correctamente"
    }
    
    Write-Host "  Nombre actualizado: $($response.data.firstName) $($response.data.lastName)" -ForegroundColor DarkGray
    Write-Host "  Teléfono actualizado: $($response.data.phone)" -ForegroundColor DarkGray
}

Test-Endpoint "PUT /api/users/profile (actualizar contraseña)" {
    $body = @{
        password = "NewPassword456"
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BaseUrl/users/profile" `
        -Method Put `
        -Headers $headers `
        -ContentType "application/json" `
        -Body $body
    
    if (-not $response.success) {
        throw "No se pudo actualizar contraseña"
    }
    
    # Verificar que podemos hacer login con la nueva contraseña
    $loginBody = @{
        email = $script:testEmail
        password = "NewPassword456"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body $loginBody
    
    if (-not $loginResponse.success) {
        throw "Login con nueva contraseña falló"
    }
    
    $script:token = $loginResponse.data.token
    $headers["Authorization"] = "Bearer $script:token"
    
    Write-Host "  Contraseña actualizada y verificada" -ForegroundColor DarkGray
}

# ============================================================================
# PRUEBA 6: Listar Usuarios
# ============================================================================
Write-Title "PRUEBA 6: Listar Usuarios"

Test-Endpoint "GET /api/users (página 1, limit 10)" {
    $response = Invoke-RestMethod -Uri "$BaseUrl/users?page=1&limit=10" `
        -Method Get `
        -Headers $headers
    
    if (-not $response.success) {
        throw "No se pudo listar usuarios"
    }
    
    if (-not $response.data.users) {
        throw "No se recibieron usuarios"
    }
    
    Write-Host "  Total usuarios: $($response.data.pagination.total)" -ForegroundColor DarkGray
    Write-Host "  Usuarios en página: $($response.data.users.Count)" -ForegroundColor DarkGray
    Write-Host "  Total páginas: $($response.data.pagination.totalPages)" -ForegroundColor DarkGray
}

Test-Endpoint "GET /api/users (paginación - página 2)" {
    $response = Invoke-RestMethod -Uri "$BaseUrl/users?page=2&limit=5" `
        -Method Get `
        -Headers $headers
    
    if (-not $response.success) {
        throw "No se pudo listar usuarios (página 2)"
    }
    
    if ($response.data.pagination.page -ne 2) {
        throw "Número de página incorrecto"
    }
}

Test-Endpoint "GET /api/users (sin token - debe fallar)" {
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/users" -Method Get
        throw "Debería haber fallado sin token"
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 401) {
            # Esperado: Unauthorized (401)
            return
        }
        throw
    }
}

# ============================================================================
# RESUMEN
# ============================================================================
Write-Host "`n"
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                     RESUMEN DE PRUEBAS                       ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Total de pruebas:    $script:totalTests" -ForegroundColor White
Write-Host "  Pruebas exitosas:    $script:passedTests" -ForegroundColor Green
Write-Host "  Pruebas fallidas:    $script:failedTests" -ForegroundColor $(if ($script:failedTests -eq 0) { "Green" } else { "Red" })
Write-Host ""

$successRate = [math]::Round(($script:passedTests / $script:totalTests) * 100, 2)
Write-Host "  Tasa de éxito:       $successRate%" -ForegroundColor $(if ($successRate -eq 100) { "Green" } else { "Yellow" })
Write-Host ""

if ($script:failedTests -eq 0) {
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                    ✓ TODAS LAS PRUEBAS PASARON               ║" -ForegroundColor Green
    Write-Host "║                    La API funciona correctamente             ║" -ForegroundColor Green
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    exit 0
} else {
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Red
    Write-Host "║                  ✗ ALGUNAS PRUEBAS FALLARON                  ║" -ForegroundColor Red
    Write-Host "║                  Revisar los errores anteriores              ║" -ForegroundColor Red
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Red
    exit 1
}
