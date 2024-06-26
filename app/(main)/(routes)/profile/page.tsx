"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { Booking, Car } from "@/types/types";
import UsersCarCard from "./_components/users-car-card";
import BookingCard from "./_components/booking-card";

const ProfilePage = () => {
  const { data: session } = useSession();
  const [cars, setCars] = useState<Car[]>([]); // Now cars is typed as an array of Car
  const [bookings, setBookings] = useState<Booking[]>([]); // State for storing bookings
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      if (session?.user?.email) {
        setLoading(true);
        setError(null);
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await fetch(
            `${apiUrl}/users-cars?userID=${encodeURIComponent(
              session.user.email
            )}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch cars: ${response.statusText}`);
          }
          const data = (await response.json()) as Car[]; // Assume that the JSON directly maps to Car[]
          setCars(data);
        } catch (err) {
          console.error("Error fetching cars:", err); // Log any errors that occur
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unexpected error occurred");
          }
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchBookings = async () => {
      if (session?.user?.email) {
        setLoading(true);
        setError(null);
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await fetch(
            `${apiUrl}/bookings?userID=${encodeURIComponent(
              session.user.email
            )}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch bookings: ${response.statusText}`);
          }
          const data = (await response.json()) as Booking[];
          setBookings(data);
        } catch (err) {
          console.error("Error fetching bookings:", err);
          setError(
            err instanceof Error ? err.message : "An unexpected error occurred"
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCars();
    fetchBookings();
  }, [session]); // Re-run the effect if the session changes, particularly when a user logs in or out

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto mt-5">
      <div>
        <h1 className="text-3xl font-bold mt-5">Your Fleet Of Listed Cars</h1>
        {cars.length > 0 ? (
          cars.map((car) => (
            <UsersCarCard key={car.CarID} car={car} /> // Use CarCard component for each car
          ))
        ) : (
          <p>No cars listed yet.</p>
        )}
      </div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mt-5">Your Upcoming Bookings!</h1>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard key={booking.BookingID} booking={booking} /> // Use CarCard component for each car
          ))
        ) : (
          <p>No bookings yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

//test
