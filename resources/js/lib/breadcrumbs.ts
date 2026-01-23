
export interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

export const breadcrumbConfig: Record<string, BreadcrumbItem[]> = {
  // Admin routes
  'admin.dashboard': [
    { label: 'Dashboard', current: true }
  ],
  
  'admin.crops.index': [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Vegetables', current: true }
  ],
  
  'admin.crops.create': [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Vegetables', href: '/admin/crops' },
    { label: 'Add New', current: true }
  ],
  
  'admin.crops.edit': [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Vegetables', href: '/admin/crops' },
    { label: 'Edit', current: true }
  ],
  
  'admin.crops.show': [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Vegetables', href: '/admin/crops' },
    { label: 'Details', current: true }
  ],
  
  'admin.prices.index': [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Price Insights', current: true }
  ],
  
  'admin.price-trends': [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Price Trends', current: true }
  ],
  
  'admin.farmers.index': [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Farmers', current: true }
  ],
  
  'admin.gis.index': [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Geolocation', current: true }
  ],
  
  'admin.demo.index': [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Demographics', current: true }
  ],
  
  // Farmer routes
  'farmer.show': [
    { label: 'My Profile', current: true }
  ],
  
  'farmer.plantings.index': [
    { label: 'My Profile', href: '/farmer/profile' },
    { label: 'Plantings', current: true }
  ],
  
  // Dealer routes
  'dealer.profile.show': [
    { label: 'Profile', current: true }
  ],
  
  'dealer.marketplace.index': [
    { label: 'Marketplace', current: true }
  ],
}

/**
 * Generate breadcrumbs from current route
 * @param routeName - Current route name from route().current()
 * @param params - Optional dynamic parameters for breadcrumb labels
 */
export function getBreadcrumbs(
  routeName: string, 
  params?: Record<string, any>
): BreadcrumbItem[] {
  const breadcrumbs = breadcrumbConfig[routeName]
  
  if (!breadcrumbs) {
    // Fallback: generate breadcrumbs from route name
    return generateFromRouteName(routeName, params)
  }
  
  return breadcrumbs
}

/**
 * Fallback generator for routes not in config
 */
function generateFromRouteName(
  routeName: string, 
  params?: Record<string, any>
): BreadcrumbItem[] {
  const parts = routeName.split('.')
  const breadcrumbs: BreadcrumbItem[] = []
  
  // Build path progressively
  let path = ''
  parts.forEach((part, index) => {
    path += (index === 0 ? '' : '.') + part
    const isLast = index === parts.length - 1
    
    breadcrumbs.push({
      label: formatLabel(part, params),
      href: isLast ? undefined : `/${parts.slice(0, index + 1).join('/')}`,
      current: isLast
    })
  })
  
  return breadcrumbs
}

/**
 * Format a route part into a readable label
 */
function formatLabel(part: string, params?: Record<string, any>): string {
  // Handle special cases
  const specialCases: Record<string, string> = {
    'gis': 'Geolocation',
    'demo': 'Demographics',
    'admin': 'Dashboard',
  }
  
  if (specialCases[part]) {
    return specialCases[part]
  }
  
  // Check if we have a param that matches this part
  if (params && params[part]) {
    return params[part]
  }
  
  // Default: capitalize and remove dashes
  return part
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Helper to add dynamic breadcrumb
 * Useful for pages with dynamic content (e.g., crop name)
 */
export function addDynamicBreadcrumb(
  baseBreadcrumbs: BreadcrumbItem[],
  label: string,
  href?: string
): BreadcrumbItem[] {
  // Remove 'current' flag from last item
  const updated = baseBreadcrumbs.map(bc => ({ ...bc, current: false }))
  
  // Add new item
  updated.push({ label, href, current: true })
  
  return updated
}