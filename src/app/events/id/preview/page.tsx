'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { useAppStore } from '@/store/store';

interface Event {
  _id: string;
  title: string;
  type: string;
  eventDate: string;
  eventTime: string;
  location: string;
  description: string;
  templateId?: any;
  status: string;
}

export default function EventPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAppStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [testPhone, setTestPhone] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const eventId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          headers: {
            'x-user-id': user?._id || '',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError('Failed to load event');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [isAuthenticated, user, router, eventId]);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?._id || '',
        },
        body: JSON.stringify({
          eventId,
          phone: testPhone,
          isTest: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to send test message');
        return;
      }

      setMessage('Test message sent successfully! ✅');
      setTestPhone('');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Failed to send test message');
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <p className="text-center text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card>
            <CardBody>
              <p className="text-center text-red-600">Event not found</p>
              <div className="mt-4 text-center">
                <Link href="/dashboard">
                  <Button>Back to Dashboard</Button>
                </Link>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.eventDate);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="secondary">← Back to Dashboard</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Preview Card */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-primary-500">
              <CardHeader>
                <h1 className="text-3xl font-bold text-gray-900">
                  {event.title}
                </h1>
                <p className="text-primary-600 mt-2 capitalize">
                  {event.type} Event
                </p>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase">
                      Date & Time
                    </p>
                    <p className="text-lg text-gray-900 mt-1">
                      📅 {eventDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      at {event.eventTime}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm font-semibold uppercase">
                      Location
                    </p>
                    <p className="text-lg text-gray-900 mt-1">
                      📍 {event.location}
                    </p>
                  </div>

                  {event.description && (
                    <div>
                      <p className="text-gray-600 text-sm font-semibold uppercase">
                        Description
                      </p>
                      <p className="text-gray-700 mt-1">{event.description}</p>
                    </div>
                  )}

                  {event.templateId && (
                    <div>
                      <p className="text-gray-600 text-sm font-semibold uppercase">
                        Template
                      </p>
                      <p className="text-gray-700 mt-1">
                        {event.templateId.name || 'Default Template'}
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-bold">Next Steps</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                {/* Send Test WhatsApp */}
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Send Test Message
                  </p>
                  <form onSubmit={handleSendTest} className="space-y-2">
                    <Input
                      type="tel"
                      placeholder="Phone (e.g. +972512345678)"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      isLoading={isSending}
                      className="w-full"
                      size="sm"
                    >
                      📲 Send Test
                    </Button>
                  </form>
                </div>

                {/* Status Messages */}
                {message && (
                  <div className="p-3 bg-green-50 text-green-600 text-sm rounded">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded">
                    {error}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="border-t pt-4 space-y-2">
                  <Link href={`/events/${eventId}/contacts`} className="block">
                    <Button variant="secondary" className="w-full" size="sm">
                      👥 Manage Contacts
                    </Button>
                  </Link>

                  <Link href={`/events/${eventId}/schedule`} className="block">
                    <Button className="w-full" size="sm">
                      📅 Schedule Send
                    </Button>
                  </Link>
                </div>

                {/* Event Info */}
                <div className="border-t pt-4 text-sm text-gray-600">
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className="capitalize text-primary-600">
                      {event.status}
                    </span>
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
