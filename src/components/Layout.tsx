import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ClipboardList,
  LogOut,
  Menu,
} from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "../components/ui/sheet";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";

import { Button } from "../components/ui/button";

const Layout = () => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Engineers", href: "/engineers", icon: Users },
    { name: "Projects", href: "/projects", icon: FolderKanban },
    { name: "Assignments", href: "/assignments", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Menu using Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="m-4">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 bg-background text-foreground"
          >
            <div className="mb-6 font-semibold text-lg">Menu</div>
            <nav className="space-y-2">
              {navigation.map(({ name, href, icon: Icon }) => (
                <SheetClose asChild>
                  <NavLink
                    key={name}
                    to={href}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                    }
                  >
                    <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                    {name}
                  </NavLink>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-card text-foreground border-r border-border">
        <div className="flex items-center px-6 py-4 border-b border-border">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h1 className="ml-3 text-lg font-semibold">ERM System</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map(({ name, href, icon: Icon }) => (
            <NavLink
              key={name}
              to={href}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
              }
            >
              <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
              {name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-card border-b border-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="hidden lg:block text-sm">
            Welcome, <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium transition-colors bg-accent text-accent-foreground">
              {user?.role}
            </span>

            {/* Logout Confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to logout?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will end your current session.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={logout}>Logout</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
