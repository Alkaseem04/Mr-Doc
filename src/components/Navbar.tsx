import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun, Stethoscope, User, LogOut } from 'lucide-react';
import { useTheme } from "@/components/ThemeProvider";
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: t('home'), path: '/' },
    { name: t('symptom_checker'), path: '/symptom-checker' },
    { name: t('doctors'), path: '/doctors' },
    { name: t('emergency'), path: '/emergency' },
    { name: t('medicine'), path: '/medicine' },
    { name: t('diet'), path: '/diet' },
    { name: t('resources'), path: '/resources' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleBookAppointment = () => {
    // Navigate to the doctors page
    window.location.href = '/doctors';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md shadow-sm">
      <div className="health-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Stethoscope className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Mr.Doc
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors hover:text-primary nav-link ${
                isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSelector />
          
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-full border-border hover:bg-muted"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-foreground" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User info and actions */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Logged in as: {user.role === 'doctor' ? 'Dr. ' : ''}{user.name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="h-9 border-border hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-1">Logout</span>
              </Button>
            </div>
          ) : (
            <>
              {/* Book Appointment Button - Only on desktop */}
              <Button 
                className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-2 h-9 transition-all duration-300 hover:scale-105 active:scale-95"
                onClick={handleBookAppointment}
              >
                <span>{t('book_appointment')}</span>
              </Button>

              {/* Admin Users Link - Only visible to admins */}
              <Link to="/admin/users" className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary nav-link">
                <span>{t('admin')}</span>
              </Link>
            </>
          )}

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden rounded-full border-border hover:bg-muted h-9 w-9">
                <Menu className="h-5 w-5 text-foreground" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background border-border">
              <nav className="flex flex-col gap-4 pt-8">
                {user ? (
                  <>
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-4">
                      <User className="h-4 w-4" />
                      <span>Logged in as: {user.role === 'doctor' ? 'Dr. ' : ''}{user.name}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setIsOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="h-9 border-border hover:bg-muted justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Logout</span>
                    </Button>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin/users"
                        className="text-lg font-medium transition-colors hover:text-primary text-muted-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        {t('admin')}
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`text-lg font-medium transition-colors hover:text-primary ${
                          isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <Link
                      to="/admin/users"
                      className="text-lg font-medium transition-colors hover:text-primary text-muted-foreground"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('admin')}
                    </Link>
                    {/* Mobile Book Appointment Button */}
                    <Button 
                      className="flex md:hidden items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 py-2 h-9 transition-all duration-300 hover:scale-105 active:scale-95 mt-4"
                      onClick={() => {
                        setIsOpen(false);
                        setTimeout(() => {
                          handleBookAppointment();
                        }, 300);
                      }}
                    >
                      <span>{t('book_appointment')}</span>
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;