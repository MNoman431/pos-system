
import React from "react";

const About = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-950 dark:to-slate-900">
      {/* Hero */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-10 shadow-xl border border-gray-200 dark:border-slate-800 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-slate-100 mb-4">
            About Us
          </h1>
          <p className="text-gray-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            We’re building a simple, fast, and modern experience for users.
            Our goal is to ship clean UI, reliable auth, and a delightful flow.
          </p>
        </div>
      </div>

      {/* Content blocks */}
      <div className="mx-auto max-w-6xl px-4 pb-16 grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-md border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-all duration-200">
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">Our Mission</h3>
          <p className="text-gray-600 dark:text-slate-400">
            Help users get things done with minimal clicks and beautiful UIs.
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-md border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-all duration-200">
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">Our Values</h3>
          <p className="text-gray-600 dark:text-slate-400">
            Simplicity, performance, and trust. We care about your time.
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-md border border-gray-200 dark:border-slate-800 hover:shadow-lg transition-all duration-200">
          <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-3">Our Team</h3>
          <p className="text-gray-600 dark:text-slate-400">
            A small team crafting useful features and responsive layouts.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
