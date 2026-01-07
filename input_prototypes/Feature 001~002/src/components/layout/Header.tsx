import React, { useEffect, useState } from 'react';
import { User, LogOut, Settings, Bookmark, LogIn, UserPlus } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../ui/avatar';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.reload(); // Simple reload to refresh state
  };

  const handleLogin = () => {
    // Navigate to login
    console.log("Navigate to login");
  };

  const handleSignup = () => {
    // Navigate to signup
    console.log("Navigate to signup");
  };

  return (
    <header className="sticky top-0 z-40 w-full pointer-events-none">
      <div className="flex h-14 items-center px-4 max-w-md mx-auto justify-end pointer-events-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-11 w-11">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 mr-4" align="end">
            <div className="space-y-1">
              {isLoggedIn ? (
                <>
                  <Button variant="ghost" className="w-full justify-start font-normal" onClick={() => console.log("Go to Scraps")}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    찜 목록
                  </Button>
                  <Button variant="ghost" className="w-full justify-start font-normal" onClick={() => console.log("Go to Account")}>
                    <Settings className="mr-2 h-4 w-4" />
                    계정 관리
                  </Button>
                  <div className="my-1 h-px bg-muted" />
                  <Button variant="ghost" className="w-full justify-start font-normal text-red-500 hover:text-red-500 hover:bg-red-50" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                   <div className="px-2 py-1.5 text-sm font-semibold text-center text-muted-foreground">
                    로그인이 필요해요
                  </div>
                  <div className="my-1 h-px bg-muted" />
                  <Button variant="ghost" className="w-full justify-start font-normal" onClick={handleSignup}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    회원가입하기
                  </Button>
                  <Button variant="ghost" className="w-full justify-start font-normal" onClick={handleLogin}>
                    <LogIn className="mr-2 h-4 w-4" />
                    로그인하기
                  </Button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
