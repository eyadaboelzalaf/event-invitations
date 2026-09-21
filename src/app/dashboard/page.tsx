'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { useAppStore } from '@/store/store';

interface Event {
  _id: string;
  title: string;
  eventType: string;
  eventDate: string;
  location: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppStore();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events', {
          headers: {
            'x-user-id': user?._id || '',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEvents(data.events || []);
      } catch (err) {
        setError('Failed to load events');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
            <p className="text-gray-600 mt-2">Manage your invitations</p>
          </div>
          <Link href="/events/new">
            <Button size="lg">+ Create Event</Button>
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No events yet</p>
                <Link href="/events/new">
                  <Button>Create your first event</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card key={event._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <h3 className="text-xl font-bold text-gray-900">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 capitalize">
                    {event.eventType}
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>📅 {new Date(event.eventDate).toLocaleDateString()}</p>
                    <p>📍 {event.location}</p>
                  </div>
                  <Link href={`/events/${event._id}/preview`}>
                    <Button variant="secondary" size="sm" className="w-full">
                      View & Send
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
