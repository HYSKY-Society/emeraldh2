export type MemberNavItem = { label: string; href: string; icon: string };
export type MemberNavGroup = { title: string; items: MemberNavItem[] };

// Primary destinations that show the mobile bottom tab bar (order matters).
export const MEMBER_TABS: MemberNavItem[] = [
  { label: "Home", href: "/app/home", icon: "Home" },
  { label: "Find", href: "/app/find", icon: "MapPin" },
  { label: "Community", href: "/app/community", icon: "MessagesSquare" },
  { label: "Members", href: "/app/members", icon: "Users2" },
  { label: "Profile", href: "/app/profile", icon: "User" },
];

// Full navigation for the desktop sidebar (grouped).
export const MEMBER_NAV: MemberNavGroup[] = [
  {
    title: "Fueling",
    items: [
      { label: "Home", href: "/app/home", icon: "Home" },
      { label: "Find Stations", href: "/app/find", icon: "MapPin" },
      { label: "Bookings", href: "/app/bookings", icon: "CalendarCheck" },
      { label: "Wallet", href: "/app/wallet", icon: "Wallet" },
    ],
  },
  {
    title: "Community",
    items: [
      { label: "Feed", href: "/app/community", icon: "MessagesSquare" },
      { label: "Members", href: "/app/members", icon: "Users2" },
      { label: "Events", href: "/app/events", icon: "CalendarDays" },
      { label: "Messages", href: "/app/messages", icon: "MessageSquare" },
      { label: "Notifications", href: "/app/notifications", icon: "Bell" },
      { label: "Refer & Earn", href: "/app/refer", icon: "Gift" },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Profile", href: "/app/profile", icon: "User" }],
  },
];
