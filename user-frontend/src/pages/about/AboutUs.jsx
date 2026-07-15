
import React from "react";

const About = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Hero */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl bg-white p-10 shadow-xl border border-gray-200 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            About Us
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We’re building a simple, fast, and modern experience for users.
            Our goal is to ship clean UI, reliable auth, and a delightful flow.
          </p>
        </div>
      </div>

      {/* Content blocks */}
      <div className="mx-auto max-w-6xl px-4 pb-16 grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-8 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
          <p className="text-gray-600">
            Help users get things done with minimal clicks and beautiful UIs.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Our Values</h3>
          <p className="text-gray-600">
            Simplicity, performance, and trust. We care about your time.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Our Team</h3>
          <p className="text-gray-600">
            A small team crafting useful features and responsive layouts.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
