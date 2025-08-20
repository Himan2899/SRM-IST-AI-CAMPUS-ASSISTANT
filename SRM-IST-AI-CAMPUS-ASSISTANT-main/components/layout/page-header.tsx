import type { ReactNode } from "react"

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="border-b bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
            {description && <p className="text-gray-600 dark:text-gray-400 mt-2">{description}</p>}
          </div>
          {children && <div>{children}</div>}
        </div>
      </div>
    </div>
  )
}
