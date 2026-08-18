"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  ChevronDown,
  FileText,
  Layers3,
  LogOut,
  Settings,
  Sparkles,
  Trophy,
  UserRound,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export type SessionUser = {
  id: string;
  username: string;
  email: string | null;
  fullname: string;
  role: string;
  permission:
    | { all?: boolean }
    | Array<{ model: string; actions: string[] }>;
  institution: string;
  nomenclature: string;
};

type SessionContextValue = {
  user: SessionUser | null;
  logout: () => Promise<void>;
};

const SessionContext = createContext<SessionContextValue>({
  user: null,
  logout: async () => undefined,
});

export const useSessionUser = () => useContext(SessionContext);

type SidebarChild = {
  title: string;
  href: string;
  access: SidebarAccess;
};

type SidebarAccess = {
  model: string;
  action: string;
};

type SidebarItem = {
  title: string;
  href?: string;
  icon: typeof Layers3;
  access?: SidebarAccess;
  children?: SidebarChild[];
};

const menuItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Layers3,
    access: { model: "dashboard", action: "view" },
  },
  {
    title: "Inovasi Perangkat Daerah",
    href: "/innovations",
    icon: Sparkles,
    access: { model: "innovations", action: "get-all" },
  },
  {
    title: "Lomba Inovasi Perangkat Daerah",
    icon: Trophy,
    children: [
      {
        title: "Inovasi OPD",
        href: "/lomba-inovasi/inovasi-opd",
        access: { model: "innovation-competitions", action: "get-all" },
      },
      {
        title: "Papan Peringkat",
        href: "/lomba-inovasi/papan-peringkat",
        access: { model: "innovation-competitions", action: "get-all" },
      },
    ],
  },
  {
    title: "Laporan Diklat",
    icon: FileText,
    children: [
      {
        title: "Data Laporan Diklat",
        href: "/laporan-diklat",
        access: { model: "training-reports", action: "get-all" },
      },
      {
        title: "Konfigurasi Akun Diklat",
        href: "/laporan-diklat/konfigurasi-akun",
        access: { model: "training-reports", action: "update" },
      },
    ],
  },
  {
    title: "Pengaturan",
    icon: Settings,
    children: [
      {
        title: "Role",
        href: "/settings/roles",
        access: { model: "roles", action: "get-all" },
      },
      {
        title: "Akun",
        href: "/settings/accounts",
        access: { model: "users", action: "get-by-id" },
      },
      {
        title: "Pengumuman",
        href: "/settings/announcements",
        access: { model: "announcements", action: "get-all" },
      },
      {
        title: "Konfigurasi Dashboard",
        href: "/settings/dashboard-configuration",
        access: { model: "dashboard-configurations", action: "get-by-id" },
      },
    ],
  },
];

const getPageTitle = (pathname: string) => {
  for (const item of menuItems) {
    if (item.href === pathname) return item.title;
    const activeChild = item.children?.find((child) => child.href === pathname);
    if (activeChild) return activeChild.title;
  }

  return "Karimun Innovation";
};

type AppPageHeaderProps = {
  title?: string;
  description?: string;
  actions?: ReactNode;
  userName?: string;
  userRole?: string;
};

const getInitials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export function AppPageHeader({
  title: titleOverride,
  description,
  actions,
  userName,
  userRole,
}: AppPageHeaderProps) {
  const { user, logout } = useSessionUser();
  const pathname = usePathname();
  const title = titleOverride ?? getPageTitle(pathname);
  const displayedName = userName ?? user?.fullname ?? "Pengguna";
  const displayedRole = userRole ?? user?.role ?? "-";
  const initials = getInitials(displayedName);
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  return (
    <header className="mb-6 flex min-w-0 items-center justify-between gap-3 pl-8 sm:mb-8 sm:gap-4 sm:pl-0">
      <div className="min-w-0">
        <h1 className="text-lg font-bold text-neutral-950 sm:text-xl">
          {title}
        </h1>
        <p
          suppressHydrationWarning
          className="mt-0.5 text-[13px] text-neutral-700"
        >
          {description ?? formattedDate}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {actions}
        <DropdownMenu>
          <DropdownMenuTrigger className="group/profile flex items-center gap-2 rounded-xl p-1 text-left outline-none transition hover:bg-neutral-100 focus-visible:ring-2 focus-visible:ring-[#ffb437]/40 sm:gap-3 sm:p-1.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-bold text-neutral-700 sm:size-11 sm:text-sm">
              {initials}
            </span>
            <span className="hidden sm:block">
              <span className="block text-sm font-bold">{displayedName}</span>
              <span className="block text-xs text-neutral-700">
                {displayedRole}
              </span>
            </span>
            <ChevronDown className="size-4 shrink-0 text-neutral-500 transition-transform group-data-[state=open]/profile:rotate-180" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-48 bg-white p-1.5 text-neutral-900"
          >
            <DropdownMenuItem
              render={<Link href="/settings/accounts" />}
              className="h-9 cursor-pointer text-sm"
            >
              <UserRound className="size-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="h-9 cursor-pointer text-sm"
              onClick={() => void logout()}
            >
              <LogOut className="size-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

type AppSidebarProps = {
  onLogout?: () => void;
};

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const { user, logout } = useSessionUser();
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const [openMenus, setOpenMenus] = useState<string[]>([
    "Lomba Inovasi Perangkat Daerah",
    "Laporan Diklat",
    "Pengaturan",
  ]);

  const toggleMenu = (title: string) => {
    setOpenMenus((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title],
    );
  };

  const handleNavigation = () => {
    if (isMobile) setOpenMobile(false);
  };

  const handleLogout = () => {
    onLogout?.();
    void logout();
  };

  const hasAccess = useCallback(
    (access: SidebarAccess) => {
      if (!user) return false;
      if (user.role === "Super Admin") return true;
      if (!Array.isArray(user.permission)) return user.permission?.all === true;

      return user.permission.some(
        (permission) =>
          permission.model === access.model &&
          permission.actions.includes(access.action),
      );
    },
    [user],
  );

  const accessibleMenuItems = menuItems.flatMap((item) => {
    if (item.children) {
      const children = item.children.filter((child) => hasAccess(child.access));
      return children.length ? [{ ...item, children }] : [];
    }

    return item.access && hasAccess(item.access) ? [item] : [];
  });

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-neutral-200 bg-white text-neutral-900 [&_[data-sidebar=sidebar]]:!bg-white [&_[data-sidebar=sidebar]]:!text-neutral-900"
    >
      <SidebarHeader className="relative shrink-0 items-center justify-center px-3 pb-5 pt-15 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:pb-4 group-data-[collapsible=icon]:pt-15">
        <Image
          src="/images/logo-karimun.webp"
          alt="Lambang Provinsi Kepulauan Riau"
          width={78}
          height={92}
          priority
          className="h-auto w-[90px] transition-all group-data-[collapsible=icon]:w-8"
        />
        <SidebarTrigger className="absolute right-2 top-4 text-neutral-700 hover:bg-neutral-100 [&_svg]:!size-4 group-data-[collapsible=icon]:left-1/2 group-data-[collapsible=icon]:right-auto group-data-[collapsible=icon]:top-3 group-data-[collapsible=icon]:-translate-x-1/2" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-3 group-data-[collapsible=icon]:px-0">
          <SidebarGroupLabel className="px-1 text-[12px] text-neutral-500">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 group-data-[collapsible=icon]:items-center">
              {accessibleMenuItems.map((item) => {
                const Icon = item.icon;
                const hasActiveChild = item.children?.some(
                  (child) => pathname === child.href,
                );
                const isOpen = !openMenus.includes(item.title);

                if (item.children) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={hasActiveChild}
                        onClick={() => toggleMenu(item.title)}
                        className="h-10 gap-3 px-3 text-[13px] font-medium text-neutral-800 data-active:bg-[#ffb437] data-active:text-white hover:bg-amber-50 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:[&>span]:hidden"
                      >
                        <Icon className="!size-4.5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      <SidebarMenuAction
                        aria-label={`${isOpen ? "Tutup" : "Buka"} ${item.title}`}
                        aria-expanded={isOpen}
                        onClick={() => toggleMenu(item.title)}
                        className="top-2.5"
                      >
                        <ChevronDown
                          className={cn(
                            "transition-transform duration-200 mt-1.5",
                            isOpen && "rotate-180",
                          )}
                        />
                      </SidebarMenuAction>

                      {isOpen && (
                        <SidebarMenuSub className="ml-4 mt-1.5 gap-1.5 border-neutral-200 py-1.5 pl-3">
                          {item.children.map((child) => (
                            <SidebarMenuSubItem key={child.href}>
                              <SidebarMenuSubButton
                                render={
                                  <Link
                                    href={child.href}
                                    onClick={handleNavigation}
                                  />
                                }
                                isActive={pathname === child.href}
                                className="h-8 px-3 text-[13px] text-neutral-500 data-active:bg-amber-50 data-active:text-[#d98700] hover:bg-neutral-50"
                              >
                                <span className="text-[13px]">
                                  {child.title}
                                </span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={
                        <Link
                          href={item.href ?? "#"}
                          onClick={handleNavigation}
                        />
                      }
                      tooltip={item.title}
                      isActive={pathname === item.href}
                      className="h-10 gap-3 px-3 text-[13px] font-medium text-neutral-800 data-active:bg-[#ffb437] data-active:text-white hover:bg-amber-50 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:[&>span]:hidden"
                    >
                      <Icon className="!size-4.5" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 pb-5 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Keluar"
              onClick={handleLogout}
              className="h-9 text-[13px] font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:[&>span]:hidden"
            >
              <LogOut />
              <span>Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

type AppSidebarLayoutProps = {
  children: ReactNode;
  onLogout?: () => void;
  defaultOpen?: boolean;
};

export function AppSidebarLayout({
  children,
  onLogout,
  defaultOpen = true,
}: AppSidebarLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch("/api/session", { cache: "no-store" });

        if (!response.ok) {
          localStorage.removeItem("hr_user_data");
          router.replace("/login?reason=session_expired");
          return;
        }

        const result = (await response.json()) as { data: SessionUser };
        setUser(result.data);
        localStorage.setItem("hr_user_data", JSON.stringify(result.data));
      } catch {
        toast.add({
          title: "Sesi bermasalah",
          description: "Silakan muat ulang halaman.",
          type: "error",
        });
      }
    };

    void loadSession();
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("hr_user_data");
      setUser(null);
      toast.add({
        title: "Berhasil keluar",
        description: "Sesi Anda telah berakhir.",
        type: "success",
      });
      router.replace("/login");
      router.refresh();
    }
  }, [router]);

  return (
    <SessionContext.Provider value={{ user, logout }}>
      <SidebarProvider
        defaultOpen={defaultOpen}
        style={
          {
            "--sidebar-width": "19rem",
            "--sidebar-width-icon": "5rem",
            "--sidebar": "#ffffff",
            "--sidebar-foreground": "#171717",
            "--sidebar-accent": "#fff7e6",
            "--sidebar-accent-foreground": "#171717",
            "--sidebar-border": "#e5e5e5",
            "--sidebar-ring": "#ffb437",
          } as React.CSSProperties
        }
      >
        <AppSidebar onLogout={onLogout} />
        <SidebarInset className="w-0 min-w-0 overflow-x-clip bg-[#f7f8fc]">
          <SidebarTrigger className="fixed left-3 top-3 z-40 size-7 rounded-lg border border-neutral-200 bg-white text-neutral-800 shadow-md hover:bg-neutral-50 [&_svg]:!size-4 md:hidden" />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </SessionContext.Provider>
  );
}
