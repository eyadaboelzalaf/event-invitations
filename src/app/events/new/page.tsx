'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { useAppStore } from '@/store/store';

const EVENT_TYPES = [
  { value: 'wedding', label: 'Wedding' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'engagement', label: 'Engagement' },
  { value: 'brit', label: 'Brit Milah' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'corporate', label: 'Corporate Event' },
];

export default function CreateEventPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAppStore();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    eventDate: '',
    eventTime: '',
    location: '',
    description: '',
    templateId: '',
  });
  const [templates, setTemplates] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        if (response.ok) {
          const data = await response.json();
          setTemplates(data.templates || []);
          if (data.templates?.length > 0) {
            setFormData((prev) => ({
              ...prev,
              templateId: data.templates[0]._id,
            }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch templates', err);
      }
    };

    fetchTemplates();
  }, [isAuthenticated, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Combine date and time into ISO datetime string
      const isoDateTime = `${formData.eventDate}T${formData.eventTime}:00Z`;

      const payload = {
        title: formData.title,
        type: formData.type,
        eventDate: isoDateTime,
        location: formData.location,
        description: formData.description,
        templateId: formData.templateId,
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user?._id || '',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.error || 'Failed to create event' });
        console.error('API Error:', data);
        return;
      }

      router.push(`/events/${data.event._id}/preview`);
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Event</h1>

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg">
            {errors.submit}
          </div>
        )}

        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                required
              />

              <Select
                label="Event Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={EVENT_TYPES}
                error={errors.type}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date"
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                  error={errors.eventDate}
                  required
                />

                <Input
                  label="Time"
                  type="time"
                  name="eventTime"
                  value={formData.eventTime}
                  onChange={handleChange}
                  error={errors.eventTime}
                  required
                />
              </div>

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                error={errors.location}
                required
              />

              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Add details about the event..."
              />

              {templates.length > 0 && (
                <Select
                  label="Invitation Template"
                  name="templateId"
                  value={formData.templateId}
                  onChange={handleChange}
                  options={templates.map((t) => ({
                    value: t._id,
                    label: t.name,
                  }))}
                />
              )}

              <div className="flex gap-4">
                <Button
                  type="submit"
                  isLoading={isLoading}
                  size="lg"
                  className="flex-1"
                >
                  Create Event
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
