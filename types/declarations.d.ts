// Module declarations for packages without bundled types
declare module 'lucide-react' {
  import * as React from 'react'

  export interface LucideProps extends Partial<React.SVGProps<SVGSVGElement>> {
    size?: number | string
    color?: string
    strokeWidth?: number | string
    absoluteStrokeWidth?: boolean
    className?: string
  }

  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >

  // Export all icons used in this project
  export const Package: LucideIcon
  export const Globe: LucideIcon
  export const Truck: LucideIcon
  export const Shield: LucideIcon
  export const Clock: LucideIcon
  export const Star: LucideIcon
  export const ArrowRight: LucideIcon
  export const ChevronRight: LucideIcon
  export const ChevronLeft: LucideIcon
  export const ChevronDown: LucideIcon
  export const ChevronUp: LucideIcon
  export const Search: LucideIcon
  export const Menu: LucideIcon
  export const X: LucideIcon
  export const MapPin: LucideIcon
  export const Mail: LucideIcon
  export const Phone: LucideIcon
  export const Zap: LucideIcon
  export const ShoppingCart: LucideIcon
  export const Check: LucideIcon
  export const AlertTriangle: LucideIcon
  export const CheckCircle: LucideIcon
  export const Calendar: LucideIcon
  export const Plus: LucideIcon
  export const Loader2: LucideIcon
  export const LogOut: LucideIcon
  export const User: LucideIcon
  export const Eye: LucideIcon
  export const EyeOff: LucideIcon
  export const LayoutDashboard: LucideIcon
  export const Bell: LucideIcon
  export const DollarSign: LucideIcon
  export const BarChart2: LucideIcon
  export const Settings: LucideIcon
  export const Users: LucideIcon
  export const FileText: LucideIcon
  export const TestTube2: LucideIcon
  export const ExternalLink: LucideIcon
  export const Upload: LucideIcon
  export const Trash2: LucideIcon
  export const Save: LucideIcon
  export const UserX: LucideIcon
  export const UserCheck: LucideIcon
  export const TrendingUp: LucideIcon
  export const Loader: LucideIcon
  export const Send: LucideIcon
  export const ArrowLeft: LucideIcon
  export const Calculator: LucideIcon
}
