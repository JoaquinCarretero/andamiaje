# 🔧 Corrección de Husky - Error DEPRECATED

## 🐛 Problema Identificado

Al intentar hacer commit, aparecía el siguiente error:

```
husky - DEPRECATED

Please remove the following two lines from .husky/pre-commit:

#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

They WILL FAIL in v10.0.0
```

## ✅ Solución Aplicada

### Cambio en `.husky/pre-commit`

**ANTES (Formato deprecated):**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**DESPUÉS (Formato v9+):**

```bash
npx lint-staged
```

### ¿Por qué este cambio?

Husky v9+ simplificó su configuración:

1. ❌ **Ya no se requiere** el shebang `#!/usr/bin/env sh`
2. ❌ **Ya no se requiere** cargar el script `.husky/_/husky.sh`
3. ✅ Los hooks ahora ejecutan comandos directamente
4. ✅ Husky maneja la ejecución internamente

## 🎯 Resultado

Ahora puedes hacer commits sin ver el mensaje de deprecación:

```bash
git add .
git commit -m "tu mensaje"
# ✅ El pre-commit se ejecuta sin warnings
```

## 🧹 Limpieza Opcional (Recomendada)

El directorio `.husky/_/` contiene archivos template que ya no son necesarios en Husky v9+.

Si deseas limpiar estos archivos:

```bash
# Opcional: Eliminar el directorio deprecated
rm -rf .husky/_
```

**Nota:** Esto es completamente seguro y recomendado. El directorio `_/` solo contiene templates que ya no se usan.

## 📋 Verificación

### 1. Verificar que el hook funciona

```bash
# Hacer un cambio de prueba
echo "// test" >> src/test.ts

# Agregar al staging
git add src/test.ts

# Intentar commit
git commit -m "test: verificar husky"
```

**Resultado esperado:**

- ✅ lint-staged se ejecuta
- ✅ No aparece el warning de DEPRECATED
- ✅ El commit se completa (si no hay errores de lint)

### 2. Verificar la configuración

```bash
# Ver el contenido del hook
cat .husky/pre-commit

# Debería mostrar solo:
# npx lint-staged
```

## 🔄 Si necesitas reinstalar Husky

Si por alguna razón necesitas reinstalar:

```bash
# Desinstalar completamente
npm uninstall husky
rm -rf .husky

# Reinstalar con la última versión
npm install --save-dev husky
npx husky init

# Configurar pre-commit
echo "npx lint-staged" > .husky/pre-commit
```

## 📚 Referencias

- [Husky v9 Migration Guide](https://typicode.github.io/husky/migrating-from-v8-to-v9.html)
- [Husky Documentation](https://typicode.github.io/husky/)

## ✅ Estado

**Problema: RESUELTO**

El mensaje de deprecación ya no debería aparecer en futuros commits.

---

_Fecha: 13 de Octubre, 2025_
_Issue: Husky DEPRECATED warning en pre-commit_
