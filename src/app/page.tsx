import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-primary-600">🎉 Event Invitations</div>
          <div className="flex gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link href="/register" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Create Beautiful Event Invitations
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Send WhatsApp invitations for weddings, birthdays, engagements, and more.
            Support for Hebrew, English, and Arabic.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 text-lg font-semibold"
            >
              Get Started
            </Link>
            <Link
              href="#features"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg border-2 border-primary-600 hover:bg-primary-50 text-lg font-semibold"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Multiple Event Types',
                description: 'Weddings, birthdays, engagements, brit milahs, anniversaries, and corporate events.',
                icon: '🎊',
              },
              {
                title: 'Choose Templates',
                description: 'Select from pre-designed templates or upload your own custom design.',
                icon: '🎨',
              },
              {
                title: 'Bulk Sending',
                description: 'Upload contact lists and send invitations to everyone at once.',
                icon: '📧',
              },
              {
                title: 'WhatsApp Integration',
                description: 'Send beautiful invitations directly via WhatsApp.',
                icon: '💬',
              },
              {
                title: 'RSVP Tracking',
                description: 'Track confirmations and decline responses easily.',
                icon: '✅',
              },
              {
                title: 'Multi-Language',
                description: 'Full support for Hebrew, English, and Arabic.',
                icon: '🌍',
              },
            ].map((feature, index) => (
              <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to create your first invitation?</h2>
          <p className="text-white text-lg mb-8">Join thousands of users creating beautiful event invitations.</p>
          <Link
            href="/register"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg hover:bg-gray-100 text-lg font-semibold inline-block"
          >
            Start Free Today
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Event Invitations. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
