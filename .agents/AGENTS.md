# 🤖 Directivas de Agente y Normas de Desarrollo — Paganini Core

Este documento define las reglas de comportamiento, arquitectura y calidad de código que todo Agente (IA o Humano) debe seguir al modificar el código o la documentación de **Paganini Core Mobile**.

---

## 🏛️ 1. Arquitectura Hexagonal y Puertos & Adaptadores
Para garantizar el desacoplamiento de la interfaz de usuario de los servicios externos y permitir la transición fluida en Ingeniería de Software II:
1. **Regla de Dependencia:** Las vistas y componentes de React/React Native (interfaz de usuario) NUNCA deben realizar llamadas directas de red (`fetch`, `axios`) o persistencia local.
2. **Puertos (Interfaces):** Toda operación de negocio o transaccional debe invocarse a través de un puerto de repositorio o caso de uso (p. ej., `WalletRepository` o `AuthService`).
3. **Adaptadores (Mocks):** Para la entrega actual del 23 de junio, toda llamada debe resolverse usando adaptadores mock (p. ej., `MockWalletAdapter` que consume un archivo de datos locales mock en local storage).

---

## 📦 2. Monorepositorio y Estructura (pnpm workspaces)
El proyecto utiliza un monorepositorio con `Turborepo` y `pnpm`.
1. **Separación de Concernientes:**
   - `apps/mobile-wallet/`: Contiene la aplicación móvil B2C en React Native (Expo).
   - `packages/paganini-sdk/`: Contiene el SDK de pasarela de pagos B2B en React.
   - `packages/shared-logic/`: Reglas de validación, tipos TypeScript comunes y validadores.
2. **Dependencias del Workspace:** No dupliques dependencias. Si un paquete debe usarse en `mobile-wallet` y `paganini-sdk`, agrégalo a `packages/shared-logic/` y haz una referencia de workspace via pnpm.

---

## 🧪 3. Calidad de Código y Pruebas
1. **TypeScript Estricto:** Se prohíbe el uso de `any`. Define tipos específicos para todas las transacciones, usuarios, contactos y respuestas de mocks.
2. **Tests Unitarios:** Toda lógica en `packages/shared-logic/` y adaptadores debe estar cubierta por pruebas unitarias usando `Jest` o `Vitest`.
3. **Consistencia de Datos Mock:** Si modificas el contrato de datos mock en la UI (`wallet-mock-contract.json`), debes actualizar el tipo TypeScript correspondiente y asegurarte de no romper las pantallas existentes.

---
