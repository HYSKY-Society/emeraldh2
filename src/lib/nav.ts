export type NavItem = { label: string; href: string; icon: string };
export type NavGroup = { title: string; items: NavItem[] };

export const NAV: NavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" }],
  },
  {
    title: "People",
    items: [
      { label: "Members", href: "/admin/users", icon: "Users" },
      { label: "Approval Queue", href: "/admin/users/approval", icon: "UserCheck" },
    ],
  },
  {
    title: "Content & CMS",
    items: [
      { label: "Homepage", href: "/admin/homepage", icon: "Home" },
      { label: "Content", href: "/admin/content", icon: "FileText" },
      { label: "News & Media", href: "/admin/news", icon: "Newspaper" },
      { label: "Donations", href: "/admin/donations", icon: "HeartHandshake" },
      { label: "Refer & Earn", href: "/admin/refer-earn", icon: "Gift" },
      { label: "Bulk Mailing", href: "/admin/mail", icon: "Mail" },
    ],
  },
  {
    title: "App & Booking",
    items: [
      { label: "Stations", href: "/admin/stations", icon: "Fuel" },
      { label: "Bookings", href: "/admin/bookings", icon: "CalendarCheck" },
      { label: "Transactions", href: "/admin/transactions", icon: "Receipt" },
      { label: "App Training", href: "/admin/app-training", icon: "Smartphone" },
      { label: "Safety Questions", href: "/admin/questions", icon: "ClipboardCheck" },
    ],
  },
  {
    title: "Membership Portal",
    items: [
      { label: "Forum Categories", href: "/admin/forum", icon: "MessagesSquare" },
      { label: "Web Training", href: "/admin/web-training", icon: "GraduationCap" },
      { label: "Fractional Ownership", href: "/admin/fractional", icon: "Building2" },
      { label: "Car Waitlist", href: "/admin/car-waitlist", icon: "CarFront" },
      { label: "Car Applications", href: "/admin/car-applications", icon: "FileSignature" },
    ],
  },
  {
    title: "Settings",
    items: [
      { label: "General", href: "/admin/settings", icon: "Settings" },
      { label: "Mail Setup", href: "/admin/settings/mail", icon: "AtSign" },
    ],
  },
];
