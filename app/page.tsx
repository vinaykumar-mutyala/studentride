"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

const sampleRides = [
  {
    id: 1,
    name: "Rahul K.",
    from: "Hyderabad",
    to: "Vijayawada",
    date: "Nov 20",
    time: "8:00 AM",
    seats: 2,
    price: "₹450",
    initials: "RK",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    id: 2,
    name: "Priya S.",
    from: "Bangalore",
    to: "Chennai",
    date: "Nov 21",
    time: "7:30 AM",
    seats: 3,
    price: "₹550",
    initials: "PS",
    color: "bg-rose-100 text-rose-700",
  },
  {
    id: 3,
    name: "Arjun M.",
    from: "Hyderabad",
    to: "Warangal",
    date: "Nov 22",
    time: "9:00 AM",
    seats: 1,
    price: "₹250",
    initials: "AM",
    color: "bg-emerald-100 text-emerald-700",
  },
];

const steps = [
  {
    number: "01",
    title: "Find your journey",
    description:
      "Enter your pickup location, destination, and travel date to explore available journeys.",
  },
  {
    number: "02",
    title: "Connect with students",
    description:
      "Discover fellow students travelling in the same direction and coordinate your plans.",
  },
  {
    number: "03",
    title: "Travel together",
    description:
      "Share your journey, coordinate your travel, and split expenses with other students.",
  },
];

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [searched, setSearched] = useState(false);
  const [today, setToday] = useState("");
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    const date = new Date();

    const localDate = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");

    setToday(localDate);
    setCurrentYear(String(date.getFullYear()));
  }, []);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearched(true);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
        <nav className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-200">
              S
            </span>
            <span className="text-2xl font-extrabold tracking-tight">
              Student<span className="text-indigo-600">Ride</span>
            </span>
          </a>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-600">
            <a href="#find-rides" className="transition hover:text-indigo-600">
              Find a ride
            </a>
            <a
              href="#how-it-works"
              className="transition hover:text-indigo-600"
            >
              How it works
            </a>
            <a href="#offer-ride" className="transition hover:text-indigo-600">
              Offer a ride
            </a>
          </div>

          <a
            href="#find-rides"
            className="hidden rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 sm:inline-flex"
          >
            Get started
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#171443] px-5 py-20 text-white sm:px-6 md:py-28">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">
          <div>
            <span className="mb-6 inline-flex rounded-full border border-indigo-300/30 bg-indigo-400/10 px-4 py-2 text-sm font-medium text-indigo-200">
              Your campus. Your community. Your ride.
            </span>

            <h1 className="max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Better journeys
              <span className="block text-indigo-300">
                start together.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-indigo-100/80 sm:text-lg">
              Connect with fellow students, share your journey, and make
              travelling between college and home easier.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#find-rides"
                className="rounded-xl bg-white px-6 py-3.5 font-bold text-indigo-950 shadow-lg transition hover:-translate-y-1 hover:bg-indigo-50"
              >
                Find a ride <span aria-hidden="true">→</span>
              </a>

              <a
                href="#offer-ride"
                className="rounded-xl border border-white/30 px-6 py-3.5 font-bold text-white transition hover:bg-white/10"
              >
                Offer a ride
              </a>
            </div>

            <div className="mt-12 flex flex-wrap gap-10 text-sm text-indigo-200">
              <div>
                <p className="text-xl font-bold text-white">Student-first</p>
                <p className="mt-1">Built for campus communities</p>
              </div>

              <div>
                <p className="text-xl font-bold text-white">Shared journeys</p>
                <p className="mt-1">Travel together</p>
              </div>
            </div>
          </div>

          {/* Journey Preview */}
          <div className="hidden md:block">
            <div className="rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <div className="rounded-2xl bg-white p-7 text-slate-900 shadow-xl">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold">Your next journey</p>
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                    Shared travel
                  </span>
                </div>

                <div className="mt-9 flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                    <span className="h-14 border-l-2 border-dashed border-slate-300" />
                    <span className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                  </div>

                  <div className="space-y-8">
                    <div>
                      <p className="text-xs font-bold tracking-wider text-slate-400">
                        PICKUP
                      </p>
                      <p className="mt-1 font-bold">
                        Your college or city
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold tracking-wider text-slate-400">
                        DESTINATION
                      </p>
                      <p className="mt-1 font-bold">
                        Your next destination
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                  <div>
                    <p className="text-xs font-bold tracking-wider text-slate-400">
                      TRAVEL WITH
                    </p>
                    <p className="mt-2 font-bold">Fellow students</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold tracking-wider text-slate-400">
                      YOUR BENEFIT
                    </p>
                    <p className="mt-2 font-bold">Shared expenses</p>
                  </div>
                </div>
              </div>

              <p className="px-2 pt-4 text-center text-sm text-indigo-100">
                Making every student journey easier.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Find Rides */}
      <section
        id="find-rides"
        className="scroll-mt-28 px-5 py-16 sm:px-6 md:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Start your journey
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Find your next ride
            </h2>
            <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-500">
              Tell us where you are going. Plan your journey with fellow
              students.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8 md:p-10">
            <form onSubmit={handleSearch}>
              <div className="grid gap-5 md:grid-cols-3">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Pickup location
                  </span>
                  <input
                    required
                    value={pickup}
                    onChange={(event) => {
                      setPickup(event.target.value);
                      setSearched(false);
                    }}
                    placeholder="Enter your starting city"
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Destination
                  </span>
                  <input
                    required
                    value={destination}
                    onChange={(event) => {
                      setDestination(event.target.value);
                      setSearched(false);
                    }}
                    placeholder="Where do you want to go?"
                    autoComplete="off"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">
                    Travel date
                  </span>
                  <input
                    required
                    type="date"
                    value={travelDate}
                    min={today}
                    onChange={(event) => {
                      setTravelDate(event.target.value);
                      setSearched(false);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </label>
              </div>

              <div className="mt-7 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
                <p className="text-sm text-slate-500">
                  Choose your route and preferred travel date.
                </p>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 sm:w-auto"
                >
                  Search rides <span aria-hidden="true">→</span>
                </button>
              </div>
            </form>

            {searched && (
              <div
                className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-5"
                aria-live="polite"
              >
                <p className="font-bold text-indigo-950">
                  Your search details
                </p>

                <div className="mt-3 flex flex-wrap gap-x-8 gap-y-3 text-sm text-indigo-900">
                  <p>
                    <span className="text-indigo-500">From:</span>{" "}
                    <strong>{pickup}</strong>
                  </p>

                  <p>
                    <span className="text-indigo-500">To:</span>{" "}
                    <strong>{destination}</strong>
                  </p>

                  <p>
                    <span className="text-indigo-500">Date:</span>{" "}
                    <strong>{travelDate}</strong>
                  </p>
                </div>

                <p className="mt-4 text-sm leading-6 text-indigo-800">
                  This is a search preview. Live ride search will be connected
                  when we build the backend and database.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Example Rides */}
      <section
        id="example-rides"
        className="px-5 py-16 sm:px-6 md:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
                Explore journeys
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Popular ride examples
              </h2>
              <p className="mt-3 max-w-xl leading-7 text-slate-500">
                See how journey and ride information will appear on StudentRide.
              </p>
            </div>

            <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700">
              Demo data · Not live rides
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {sampleRides.map((ride) => (
              <article
                key={ride.id}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">
                    {ride.date}
                  </span>

                  <p className="text-xl font-extrabold text-indigo-700">
                    {ride.price}
                  </p>
                </div>

                <div className="my-7 space-y-5">
                  <div className="flex gap-4">
                    <div className="mt-1 flex flex-col items-center">
                      <span className="h-3 w-3 rounded-full bg-indigo-600 ring-4 ring-indigo-50" />
                      <span className="h-8 border-l-2 border-dashed border-slate-300" />
                      <span className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
                    </div>

                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-bold tracking-wider text-slate-400">
                          FROM
                        </p>
                        <p className="mt-1 font-bold text-slate-800">
                          {ride.from}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-bold tracking-wider text-slate-400">
                          TO
                        </p>
                        <p className="mt-1 font-bold text-slate-800">
                          {ride.to}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold ${ride.color}`}
                    >
                      {ride.initials}
                    </span>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        {ride.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {ride.time}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                    {ride.seats} seats
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="scroll-mt-28 bg-white px-5 py-20 sm:px-6"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Simple and convenient
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              How StudentRide works
            </h2>
            <p className="mt-4 leading-7 text-slate-500">
              Three simple steps to make your next journey easier.
            </p>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-7 text-center transition hover:border-indigo-100 hover:bg-indigo-50/50"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-lg font-extrabold text-indigo-700">
                  {step.number}
                </div>

                <h3 className="mt-5 text-xl font-extrabold">
                  {step.title}
                </h3>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer a Ride */}
      <section
        id="offer-ride"
        className="scroll-mt-28 px-5 py-16 sm:px-6"
      >
        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 overflow-hidden rounded-3xl bg-indigo-600 px-7 py-12 text-center text-white shadow-xl shadow-indigo-200 sm:px-12 md:flex-row md:text-left">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-200">
              Make every seat count
            </p>

            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Have an empty seat?
            </h2>

            <p className="mt-4 max-w-xl leading-7 text-indigo-100">
              Share your journey with fellow students and help make student
              travel more connected and affordable.
            </p>

            <p className="mt-4 text-sm font-semibold text-indigo-200">
              Ride publishing will be available when the backend is built.
            </p>
          </div>

          <a
            href="#example-rides"
            className="relative shrink-0 rounded-xl bg-white px-7 py-3.5 text-sm font-extrabold text-indigo-700 shadow-lg transition hover:-translate-y-1 hover:bg-indigo-50"
          >
            Explore ride examples →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-5 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <a href="#" className="text-xl font-extrabold">
            Student<span className="text-indigo-600">Ride</span>
          </a>

          <p className="text-sm text-slate-500">
            A student-focused platform for sharing journeys.
          </p>

          <p className="text-sm text-slate-400">
            © {currentYear} StudentRide
          </p>
        </div>
      </footer>
    </main>
  );
}