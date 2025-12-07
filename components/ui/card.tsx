import * as React from "react"

import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "relative flex flex-col rounded-2xl",
        "bg-white/[0.02] backdrop-blur-sm",
        "border border-white/[0.04]",
        "transition-all duration-300 ease-out",
        "hover:bg-white/[0.03] hover:border-white/[0.06]",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5 p-5 pb-0",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-[13px] font-medium text-white/50 tracking-wide uppercase",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-white/40", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "absolute top-4 right-4",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-5", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center p-5 pt-0 mt-auto",
        className
      )}
      {...props}
    />
  )
}

// New: Bento card variant for dashboard
function BentoCard({
  className,
  gradient,
  ...props
}: React.ComponentProps<"div"> & { gradient?: string }) {
  return (
    <div
      data-slot="bento-card"
      className={cn(
        "group relative flex flex-col rounded-2xl overflow-hidden",
        "bg-white/[0.02] backdrop-blur-sm",
        "border border-white/[0.04]",
        "transition-all duration-300 ease-out",
        "hover:bg-white/[0.03] hover:border-white/[0.08]",
        "hover:shadow-xl hover:shadow-black/20",
        className
      )}
      {...props}
    >
      {/* Subtle gradient overlay on hover */}
      {gradient && (
        <div
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            gradient
          )}
        />
      )}
      {props.children}
    </div>
  )
}

// Stat card for metrics
function StatCard({
  className,
  icon,
  label,
  value,
  trend,
  trendUp,
  ...props
}: React.ComponentProps<"div"> & {
  icon?: React.ReactNode
  label?: string
  value?: string | number
  trend?: string
  trendUp?: boolean
}) {
  return (
    <div
      data-slot="stat-card"
      className={cn(
        "group relative flex flex-col gap-3 p-5 rounded-2xl",
        "bg-white/[0.02] backdrop-blur-sm",
        "border border-white/[0.04]",
        "transition-all duration-300 ease-out",
        "hover:bg-white/[0.03] hover:border-white/[0.06]",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        {icon && (
          <div className="p-2 rounded-lg bg-white/[0.04]">
            {icon}
          </div>
        )}
        {trend && (
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full",
            trendUp
              ? "text-emerald-400 bg-emerald-400/10"
              : "text-red-400 bg-red-400/10"
          )}>
            {trend}
          </span>
        )}
      </div>
      {label && (
        <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">
          {label}
        </span>
      )}
      {value && (
        <span className="text-2xl font-semibold text-white tracking-tight">
          {value}
        </span>
      )}
      {props.children}
    </div>
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  BentoCard,
  StatCard,
}
