'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/store';
import { Button } from '@/components/Button';

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAppStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary-600">
          🎉 EventInvite
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {isAuthenticated && user ? (
            <>
              <div className="text-sm">
                <p className="text-gray-600">Welcome back</p>
                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
