"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/context/Auth/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import { getInitials, getUserColor } from "@/services/utils";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Bell, BellOff, LogOut, Moon, Sun, UserCircle } from "lucide-react";
import { useState } from "react";

export function UserPreferencesModal() {
  const { theme, setTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const { user, logout } = useAuth();

  const userColor = getUserColor(user?.name);

  // Handle dark mode toggle
  const handleDarkModeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Handle notifications toggle
  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // In a real app, you would handle notification permissions here
  };

  // Handle logout
  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.avatar_url} alt={user?.name} />
            <AvatarFallback>
              <UserCircle className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{user?.name}</span>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Preferences</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {/* User Profile Section */}
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className={`text-lg ${userColor}`}>
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{user?.name}</h3>
              <p className="text-sm text-gray-500">
                Joined as chat participant
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Appearance */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Appearance</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isDarkMode ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={handleDarkModeToggle}
              />
            </div>
          </div>

          <Separator className="my-4" />

          {/* Notifications */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Notifications</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {notificationsEnabled ? (
                  <Bell className="h-4 w-4" />
                ) : (
                  <BellOff className="h-4 w-4" />
                )}
                <Label htmlFor="notifications">Enable Notifications</Label>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={handleNotificationsToggle}
              />
            </div>
          </div>

          <Separator className="my-4" />
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="mt-2 sm:mt-0 w-full sm:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
