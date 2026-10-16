import Link from "next/link";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

/**
 * Page title row: breadcrumb trail, title + description, and an actions slot.
 * @param {{ title: string, description?: string, breadcrumbs?: {label: string, href?: string}[], actions?: React.ReactNode, icon?: any, className?: string }} props
 */
export function PageHeader({ title, description, breadcrumbs = [], actions, icon: Icon, className, children }) {
  const trail = [{ label: "Dashboard", href: "/admin" }, ...breadcrumbs];

  return (
    <div className={cn("mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between", className)}>
      <div className="min-w-0 space-y-2">
        {breadcrumbs.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList className="text-xs">
              {trail.map((item, i) => {
                const last = i === trail.length - 1;
                return (
                  <Fragment key={`${item.label}-${i}`}>
                    <BreadcrumbItem>
                      {last || !item.href ? (
                        <BreadcrumbPage className="max-w-[16rem] truncate">{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <Link href={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!last && <BreadcrumbSeparator />}
                  </Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand sm:flex">
              <Icon className="h-5 w-5" />
            </span>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">{title}</h1>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
        </div>
        {children}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
