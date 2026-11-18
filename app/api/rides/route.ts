
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT
        id,
        driver_name AS "driverName",
        pickup,
        destination,
        ride_date AS date,
        available_seats AS "availableSeats",
        price
       FROM rides
       ORDER BY created_at DESC`
    );

    return NextResponse.json({
      success: true,
      totalRides: result.rows.length,
      rides: result.rows,
    });
  } catch (error) {
    console.error("Failed to fetch rides:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch rides" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      driverName,
      pickup,
      destination,
      date,
      availableSeats,
      price,
    } = body;

    if (
      typeof driverName !== "string" ||
      !driverName.trim() ||
      typeof pickup !== "string" ||
      !pickup.trim() ||
      typeof destination !== "string" ||
      !destination.trim() ||
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isInteger(availableSeats) ||
      availableSeats < 1 ||
      typeof price !== "number" ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid ride details" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO rides
        (driver_name, pickup, destination, ride_date, available_seats, price)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING
        id,
        driver_name AS "driverName",
        pickup,
        destination,
        ride_date AS date,
        available_seats AS "availableSeats",
        price`,
      [
        driverName.trim(),
        pickup.trim(),
        destination.trim(),
        date,
        availableSeats,
        price,
      ]
    );

    return NextResponse.json(
      {
        success: true,
        message: "Ride created successfully",
        ride: result.rows[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create ride:", error);

    return NextResponse.json(
      { success: false, message: "Unable to create ride" },
      { status: 500 }
    );
  }
}
