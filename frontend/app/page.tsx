"use client";

import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Deliberate syntax error to see if CI catches this.
  const a = ;

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear status when user edits
    if (status) setStatus("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Submitted successfully!");

        // Reset form
        setForm({
          name: "",
          email: "",
          message: "",
        });
      } else {
        setStatus(data.error || "Error");
      }
    } catch (err) {
      setStatus("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-10 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Contact Form</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={form.name}
          placeholder="Name"
          onChange={(e) => handleChange("name", e.target.value)}
        />

        <input
          value={form.email}
          placeholder="Email"
          onChange={(e) => handleChange("email", e.target.value)}
        />

        <textarea
          value={form.message}
          placeholder="Message"
          onChange={(e) => handleChange("message", e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Submit"}
        </button>
      </form>

      <p className="mt-4">{status}</p>
    </main>
  );
}