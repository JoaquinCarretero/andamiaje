"use client";

import { Fragment } from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import colors from "@/lib/colors";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  separator?: React.ReactNode;
  className?: string;
}

/**
 * Componente de navegación Breadcrumbs accesible y responsive
 * Ayuda a los usuarios a entender su ubicación en la jerarquía del sitio
 *
 * Cumple con WCAG 2.1 y utiliza estructura semántica apropiada
 *
 * Uso:
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { label: "Dashboard", href: "/terapeuta" },
 *     { label: "Plan de Trabajo", current: true }
 *   ]}
 *   showHome
 * />
 * ```
 */
export function Breadcrumbs({
  items,
  showHome = true,
  separator,
  className = "",
}: BreadcrumbsProps) {
  // Agregar home si está habilitado
  const allItems: BreadcrumbItem[] = showHome ? [{ label: "Inicio", href: "/", icon: Home }, ...items] : items;

  // Separador por defecto
  const defaultSeparator = <ChevronRight className="h-4 w-4" style={{ color: colors.textMuted }} />;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 ${className}`}>
      <ol className="flex items-center space-x-2 flex-wrap">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isCurrent = item.current || isLast;

           return (
             <Fragment key={`${item.label}-${index}`}>
               <li className="flex items-center">
                 {(item.href || item.onClick) && !isCurrent ? (
                   item.onClick ? (
                     <button
                       onClick={item.onClick}
                       className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:underline"
                       style={{
                         color: colors.textSecondary,
                       }}
                       aria-current={isCurrent ? "page" : undefined}
                     >
                       {"icon" in item && item.icon && <item.icon className="h-4 w-4" />}
                       <span>{item.label}</span>
                     </button>
                   ) : (
                     <Link
                       href={item.href!}
                       className="flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 hover:underline"
                       style={{
                         color: colors.textSecondary,
                       }}
                       aria-current={isCurrent ? "page" : undefined}
                     >
                       {"icon" in item && item.icon && <item.icon className="h-4 w-4" />}
                       <span>{item.label}</span>
                     </Link>
                   )
                 ) : (
                  <span
                    className="flex items-center gap-1.5 text-sm font-medium"
                    style={{
                      color: isCurrent ? colors.text : colors.textSecondary,
                    }}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    {"icon" in item && item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>

              {/* Separador - no mostrar después del último item */}
              {!isLast && (
                <li className="flex items-center" aria-hidden="true" role="presentation">
                  {separator || defaultSeparator}
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Variante compacta para móvil
 * Solo muestra el último nivel con opción de volver
 */
export function BreadcrumbsMobile({
  items,
  onBack,
  className = "",
}: {
  items: BreadcrumbItem[];
  onBack?: () => void;
  className?: string;
}) {
  const currentItem = items[items.length - 1];
  const parentItem = items[items.length - 2];

  if (!parentItem) return null;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center ${className}`}>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
        style={{ color: colors.textSecondary }}
        aria-label={`Volver a ${parentItem.label}`}
      >
        <ChevronRight className="h-4 w-4 rotate-180" />
        <span className="truncate max-w-[150px]">{parentItem.label}</span>
      </button>

      <ChevronRight
        className="h-4 w-4 mx-2"
        style={{ color: colors.textMuted }}
        aria-hidden="true"
      />

      <span
        className="text-sm font-medium truncate max-w-[150px]"
        style={{ color: colors.text }}
        aria-current="page"
      >
        {currentItem.label}
      </span>
    </nav>
  );
}

/**
 * Hook para generar breadcrumbs automáticamente desde la ruta
 */
export function useBreadcrumbs(
  pathname: string,
  customLabels?: Record<string, string>
): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = customLabels?.[segment] || formatSegment(segment);
    const current = index === segments.length - 1;

    return {
      label,
      href: current ? undefined : href,
      current,
    };
  });

  return breadcrumbs;
}

// Formatear segmento de URL a texto legible
function formatSegment(segment: string): string {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
