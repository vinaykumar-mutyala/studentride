
"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type Ride = {
  id: string | number;
  driverName: string;
  pickup: string;
  destination: string;
  date: string;
  availableSeats: number;
  price: string | number;
};

const avatarStyles = [
  "bg-indigo-100 text-indigo-700",
  "bg-rose-100 text-rose-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
];

function formatRideDate(value: string) {
  const datePart = value.slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

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

  const [rides, setRides] = useState<Ride[]>([]);
  const [ridesLoading, setRidesLoading] = useState(true);
  const [ridesError, setRidesError] = useState("");

  const [publishing, setPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState("");
  const [publishError, setPublishError] = useState(false);

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

  async function loadRides() {
    try {
      setRidesLoading(true);
      setRidesError("");

      const response = await fetch("/api/rides", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("The rides service returned an error.");
      }

      const data: {
        success: boolean;
        rides?: Ride[];
        message?: string;
      } = await response.json();

      if (!data.success || !Array.isArray(data.rides)) {
        throw new Error(data.message || "Could not load rides.");
      }

      setRides(data.rides);
    } catch (error) {
      console.error("Failed to load rides:", error);
      setRidesError(
        "We couldn't load rides. Please refresh and try again."
      );
    } finally {
      setRidesLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadInitialRides() {
      try {
        const response = await fetch("/api/rides", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("The rides service returned an error.");
        }

        const data: {
          success: boolean;
          rides?: Ride[];
          message?: string;
        } = await response.json();

        if (!data.success || !Array.isArray(data.rides)) {
          throw new Error(data.message || "Could not load rides.");
        }

        if (isMounted) {
          setRides(data.rides);
        }
      } catch (error) {
        console.error("Failed to load rides:", error);

        if (isMounted) {
          setRidesError(
            "We couldn't load rides. Please refresh and try again."
          );
        }
      } finally {
        if (isMounted) {
          setRidesLoading(false);
        }
      }
    }

    loadInitialRides();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRides = searched
    ? rides.filter((ride) => {
        const routeMatches =
          ride.pickup
            .toLowerCase()
            .includes(pickup.trim().toLowerCase()) &&
          ride.destination
            .toLowerCase()
            .includes(destination.trim().toLowerCase());

        const dateMatches =
          !travelDate || ride.date.slice(0, 10) === travelDate;

        return routeMatches && dateMatches;
      })
    : rides;

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearched(true);
  };

  async function handlePublishRide(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setPublishing(true);
    setPublishMessage("");
    setPublishError(false);

    const ride = {
      driverName: String(formData.get("driverName") || "").trim(),
      pickup: String(formData.get("pickup") || "").trim(),
      destination: String(formData.get("destination") || "").trim(),
      date: String(formData.get("date") || ""),
      availableSeats: Number(formData.get("availableSeats")),
      price: Number(formData.get("price")),
    };

    try {
      const response = await fetch("/api/rides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ride),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || result.message || "Unable to publish the ride."
        );
      }

      setPublishMessage(
        "Your ride has been published successfully!"
      );

      form.reset();

      setSearched(false);
      setPickup("");
      setDestination("");
      setTravelDate("");

      await loadRides();
    } catch (error) {
      setPublishError(true);

      setPublishMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while publishing your ride."
      );
    } finally {
      setPublishing(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 text-slate-900">
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

            <a href="#how-it-works" className="transition hover:text-indigo-600">
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
                      <p className="mt-1 font-bold">Your college or city</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold tracking-wider text-slate-400">
                        DESTINATION
                      </p>
                      <p className="mt-1 font-bold">Your next destination</p>
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
                    className={inputClass}
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
                    className={inputClass}
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
                    className={inputClass}
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
                  Showing rides that match your pickup, destination, and
                  travel date below.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

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
                {searched ? "Matching rides" : "Available rides"}
              </h2>

              <p className="mt-3 max-w-xl leading-7 text-slate-500">
                Rides published by drivers and saved in the StudentRide
                database.
              </p>
            </div>

            <span className="w-fit rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
              Live database data
            </span>
          </div>

          {ridesLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              Loading available rides...
            </div>
          ) : ridesError ? (
            <div
              className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700"
              role="alert"
            >
              {ridesError}
            </div>
          ) : filteredRides.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <h3 className="text-lg font-bold text-slate-800">
                {searched
                  ? "No matching rides found"
                  : "No rides available yet"}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {searched
                  ? "Try different locations or another travel date."
                  : "When a driver publishes a ride, it will appear here."}
              </p>
            </div>
          ) : (
            <>
              <p className="mb-5 text-sm text-slate-500" aria-live="polite">
                {filteredRides.length}{" "}
                {filteredRides.length === 1 ? "ride" : "rides"} found
              </p>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredRides.map((ride, index) => {
                  const initials = getInitials(ride.driverName) || "D";
                  const avatarStyle =
                    avatarStyles[index % avatarStyles.length];

                  return (
                    <article
                      key={ride.id}
                      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700">
                          {formatRideDate(ride.date)}
                        </span>

                        <p className="text-xl font-extrabold text-indigo-700">
                          ₹{Number(ride.price).toLocaleString("en-IN")}
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
                                {ride.pickup}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs font-bold tracking-wider text-slate-400">
                                TO
                              </p>

                              <p className="mt-1 font-bold text-slate-800">
                                {ride.destination}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-extrabold ${avatarStyle}`}
                          >
                            {initials}
                          </span>

                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {ride.driverName}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Driver
                            </p>
                          </div>
                        </div>

                        <span className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600">
                          {ride.availableSeats}{" "}
                          {ride.availableSeats === 1 ? "seat" : "seats"}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

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

      <section
        id="offer-ride"
        className="scroll-mt-28 px-5 py-16 sm:px-6"
      >
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-10">
          <div className="mb-8 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Make every seat count
            </p>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Offer a ride
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-500">
              Share your journey with fellow students. Enter your trip
              details below to publish your ride.
            </p>
          </div>

          <form onSubmit={handlePublishRide}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Driver name
                </span>

                <input
                  name="driverName"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="Enter your full name"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Pickup location
                </span>

                <input
                  name="pickup"
                  type="text"
                  required
                  maxLength={150}
                  placeholder="Example: Tanuku"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Destination
                </span>

                <input
                  name="destination"
                  type="text"
                  required
                  maxLength={150}
                  placeholder="Example: Hyderabad"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Travel date
                </span>

                <input
                  name="date"
                  type="date"
                  required
                  min={today}
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Available seats
                </span>

                <input
                  name="availableSeats"
                  type="number"
                  required
                  min="1"
                  max="50"
                  step="1"
                  placeholder="Example: 3"
                  className={inputClass}
                />
              </label>

              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-700">
                  Price per passenger (₹)
                </span>

                <input
                  name="price"
                  type="number"
                  required
                  min="0"
                  max="100000"
                  step="0.01"
                  placeholder="Example: 500"
                  className={inputClass}
                />
              </label>
            </div>

            {publishMessage && (
              <div
                className={`mt-6 rounded-xl border p-4 text-sm ${
                  publishError
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}
                role="status"
                aria-live="polite"
              >
                {publishMessage}
              </div>
            )}

            <div className="mt-8 border-t border-slate-100 pt-6">
              <button
                type="submit"
                disabled={publishing || !today}
                className="w-full rounded-xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {publishing ? "Publishing your ride..." : "Publish ride →"}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                Your ride details will be saved in the StudentRide database.
              </p>
            </div>
          </form>
        </div>
      </section>

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
