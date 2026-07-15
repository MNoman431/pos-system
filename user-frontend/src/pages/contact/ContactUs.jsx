
import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    setStatus("Thanks! We’ll get back to you soon.");
    setTimeout(() => setStatus(""), 2000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="mx-auto max-w-6xl px-4 py-16 grid gap-10 md:grid-cols-2">
        {/* Info card */}
        <div className="rounded-2xl bg-white p-10 shadow-xl border border-gray-200">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Have questions or feedback? Send us a message—we’d love to hear from you.
          </p>

          <div className="space-y-6 text-gray-700">
            <div>
              <p className="font-semibold text-gray-900">Email</p>
              <p className="text-gray-600">support@myapp.com</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Phone</p>
              <p className="text-gray-600">+92-300-0000000</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Address</p>
              <p className="text-gray-600">Lahore, Pakistan</p>
            </div>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-2xl bg-white p-10 shadow-xl border border-gray-200">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="name">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Muhammad Noman Rehan"
                value={form.name}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-700" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                placeholder="Write your message..."
                value={form.message}
                onChange={onChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 text-white px-4 py-3 font-semibold hover:bg-blue-700 transition-all duration-200 shadow-md"
            >
              Send Message
            </button>

            {status && (
              <p className="text-center text-sm text-green-700 bg-green-50 rounded-lg py-2 mt-4 border border-green-200">
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
