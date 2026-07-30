# Paganini Core Mobile — Frontend Prototipo

**Materia:** SOFG1007 Ingeniería de Software I · ESPOL PAO I 2026  
**Equipo 5:** Ivan Andres Salinas · Matías Collaguazo · Angie Alfonso · Arianna Feijoo  
**Repositorio:** [https://github.com/angie329/PaganiniCore](https://github.com/angie329/PaganiniCore)  
**Demo GitHub Pages:** [https://angie329.github.io/PaganiniCore](https://angie329.github.io/PaganiniCore)

---

## Arquitectura Hexagonal (Ports & Adapters)

El proyecto implementa **Arquitectura Hexagonal** en el frontend React. La separación por capas permite reemplazar el adaptador mock por una API real en Software II sin modificar la UI.

```
src/features/wallet/
├── application/      → Entidades de dominio (Wallet, Transaction)
├── contracts/        → Puerto de abstracción (WalletRepository.js — interfaz)
├── infra/            → Adaptadores (MockWalletAdapter.js — simula backend en memoria)
└── ui/               → Presentación desacoplada del origen de datos
```

### Componentes clave

| Archivo | Rol |
|---|---|
| `WalletRepository.js` | Puerto — define el contrato de operaciones de billetera |
| `MockWalletAdapter.js` | Adaptador mock — implementa el puerto con estado en memoria (`memoryDb`) |
| `useWallet.js` | Hook de aplicación — inyecta el adaptador activo al componente |
| `PaganiniPayWidget.jsx` | Widget embebible para apps externas (Suplaier) |

> **Nota sobre la pérdida de datos al recargar (F5):** Es el comportamiento intencional del `MockWalletAdapter`. El estado se mantiene en memoria RAM (`memoryDb`) para simular el backend sin servidor real. En Software II se reemplazará por `HttpWalletAdapter` conectado a la API, sin modificar una sola pantalla de UI.

---

## Stack Tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| React | 19.x | Framework UI |
| Vite | 8.x | Bundler y servidor de desarrollo |
| ESLint | 10.x | Linter estático |
| pnpm | ≥ 11.0.0 | Gestor de dependencias |
| Node | ≥ 22.0.0 | Runtime |
| GitHub Actions | — | CI/CD → GitHub Pages |

---

## Comandos de Desarrollo

```bash
# Instalar dependencias
pnpm install

# Servidor de desarrollo con HMR
pnpm run dev

# Validación estática (debe pasar antes de hacer push)
pnpm run lint

# Build de producción
pnpm run build

# Previsualizar build local
pnpm run preview
```

---

## Credenciales de Demo (Prototipo Mock)

| Campo | Valor |
|---|---|
| **Usuario** | `angie@espol.edu.ec` (Cliente) |
| **Contraseña** | `1234` |
| **PIN de autorización** | `0000` |
| **Tarjeta de recarga** | Cualquier número que empiece con `4` (ej. `4111111111111111`) |

---

## Actores y Roles

| Rol | Acceso |
|---|---|
| Cliente | Wallet personal: consultar saldo, enviar pagos, pago QR, recargar, retirar |
| Auditor | Consola de trazabilidad: buscar TX por ID, validar integridad matemática del balance |
| Administrador | Gestión de apps cliente y API Keys del ecosistema Paganini |
| App Externa | Suplaier embebe el `PaganiniPayWidget` para pago en flujo de compra |

---

## CI/CD

El workflow `.github/workflows/deploy.yml` ejecuta en cada push a `main`:
1. `pnpm install --frozen-lockfile`
2. `pnpm run lint` — validación estática
3. `pnpm run build` — bundle de producción
4. Deploy automático a GitHub Pages

---

*Proyecto académico ESPOL — no involucra transacciones financieras reales.*
