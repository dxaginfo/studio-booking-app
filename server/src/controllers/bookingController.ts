import { Request, Response } from 'express';
import { prisma } from '../index';
import { BookingStatus } from '@prisma/client';

/**
 * Get all bookings
 * @route GET /api/bookings
 */
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    // Allow filtering by status, date range, studio, client
    const { status, startDate, endDate, studioId, clientId } = req.query;

    const filter: any = {};
    
    if (status) {
      filter.status = status as BookingStatus;
    }
    
    if (startDate && endDate) {
      filter.startTime = {
        gte: new Date(startDate as string),
      };
      filter.endTime = {
        lte: new Date(endDate as string),
      };
    }
    
    if (studioId) {
      filter.studioId = studioId as string;
    }
    
    if (clientId) {
      filter.clientId = clientId as string;
    }

    const bookings = await prisma.booking.findMany({
      where: filter,
      include: {
        studio: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        staffAssignments: {
          include: {
            staff: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error fetching bookings' });
  }
};

/**
 * Get booking by ID
 * @route GET /api/bookings/:id
 */
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        studio: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        staffAssignments: {
          include: {
            staff: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        payments: true,
        prepMaterials: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error fetching booking' });
  }
};

/**
 * Create a booking
 * @route POST /api/bookings
 */
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { studioId, startTime, endTime, notes, staffIds = [] } = req.body;
    const clientId = req.user!.id;

    // Check for booking conflicts
    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        studioId,
        OR: [
          {
            startTime: { lte: new Date(startTime) },
            endTime: { gt: new Date(startTime) },
          },
          {
            startTime: { lt: new Date(endTime) },
            endTime: { gte: new Date(endTime) },
          },
          {
            startTime: { gte: new Date(startTime) },
            endTime: { lte: new Date(endTime) },
          },
        ],
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
      },
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Booking conflict: The studio is already booked during this time period' });
    }

    // Get studio details for price calculation
    const studio = await prisma.studio.findUnique({
      where: { id: studioId },
    });

    if (!studio) {
      return res.status(400).json({ message: 'Studio not found' });
    }

    // Calculate booking duration and total price
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const totalPrice = studio.hourlyRate * durationHours;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        studioId,
        clientId,
        startTime: start,
        endTime: end,
        status: BookingStatus.PENDING,
        totalPrice,
        notes,
        staffAssignments: {
          create: staffIds.map((staffId: string) => ({
            staffId,
            role: 'Engineer', // Default role, can be updated later
          })),
        },
      },
      include: {
        studio: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        staffAssignments: {
          include: {
            staff: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
};

/**
 * Update a booking
 * @route PUT /api/bookings/:id
 */
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, status, notes } = req.body;
    const userId = req.user!.id;

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized (client who made the booking or admin/staff)
    const isClient = booking.clientId === userId;
    const isAdminOrStaff = req.user!.role === 'ADMIN' || req.user!.role === 'STAFF';

    if (!isClient && !isAdminOrStaff) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // If changing time, check for conflicts
    if (startTime && endTime) {
      const conflictingBooking = await prisma.booking.findFirst({
        where: {
          id: { not: id },
          studioId: booking.studioId,
          OR: [
            {
              startTime: { lte: new Date(startTime) },
              endTime: { gt: new Date(startTime) },
            },
            {
              startTime: { lt: new Date(endTime) },
              endTime: { gte: new Date(endTime) },
            },
            {
              startTime: { gte: new Date(startTime) },
              endTime: { lte: new Date(endTime) },
            },
          ],
          status: {
            in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
          },
        },
      });

      if (conflictingBooking) {
        return res.status(400).json({ message: 'Booking conflict: The studio is already booked during this time period' });
      }
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(status && { status: status as BookingStatus }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        studio: true,
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        staffAssignments: {
          include: {
            staff: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Server error updating booking' });
  }
};

/**
 * Delete a booking
 * @route DELETE /api/bookings/:id
 */
export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { client: true },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is authorized (client who made the booking or admin)
    const isClient = booking.clientId === userId;
    const isAdmin = req.user!.role === 'ADMIN';

    if (!isClient && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    // Delete the booking
    await prisma.booking.delete({
      where: { id },
    });

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error deleting booking' });
  }
};