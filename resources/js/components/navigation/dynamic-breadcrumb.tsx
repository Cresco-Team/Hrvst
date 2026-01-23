
import { Link } from "@inertiajs/react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { getBreadcrumbs, type BreadcrumbItem as BreadcrumbItemType } from '@/lib/breadcrumbs'

interface DynamicBreadcrumbsProps {
  /**
   * Optional: Manually provide breadcrumbs
   * If not provided, will auto-generate from current route
   */
  items?: BreadcrumbItemType[]
  
  /**
   * Optional: Parameters for dynamic breadcrumb labels
   * Example: { crop: 'Cabbage' }
   */
  params?: Record<string, any>
  
  /**
   * Optional: Custom className
   */
  className?: string
}

export default function DynamicBreadcrumbs({ 
  items, 
  params,
  className 
}: DynamicBreadcrumbsProps) {
  // Auto-generate from route if not provided
  const breadcrumbs = items || getBreadcrumbs(route().current() || '', params)
  
  
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => (
          <div key={index} className="contents">
            <BreadcrumbItem>
              {item.current ? (
                // Current page - not clickable
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                // Clickable link
                <BreadcrumbLink asChild>
                  <Link href={item.href || '#'}>
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            
            {/* Add separator except after last item */}
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}