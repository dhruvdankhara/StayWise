export const roles = [
  'admin',
  'hotel_manager',
  'receptionist',
  'cleaning_staff',
  'guest'
] as const;

export const roomStatuses = [
  'available',
  'occupied',
  'dirty',
  'maintenance',
  'out_of_order'
] as const;

export const roomTypes = ['single', 'double', 'suite', 'deluxe', 'family'] as const;

export const bookingStatuses = [
  'pending',
  'confirmed',
  'checked_in',
  'checked_out',
  'cancelled'
] as const;

export const paymentStatuses = ['unpaid', 'partial', 'paid', 'refunded'] as const;

export const housekeepingPriorities = ['low', 'normal', 'high', 'urgent'] as const;

export const housekeepingStatuses = [
  'pending',
  'in_progress',
  'completed',
  'skipped'
] as const;

export const paymentMethods = ['cash', 'card', 'upi', 'online'] as const;

export type Role = (typeof roles)[number];
export type RoomStatus = (typeof roomStatuses)[number];
export type RoomType = (typeof roomTypes)[number];
export type BookingStatus = (typeof bookingStatuses)[number];
export type PaymentStatus = (typeof paymentStatuses)[number];
export type HousekeepingPriority = (typeof housekeepingPriorities)[number];
export type HousekeepingStatus = (typeof housekeepingStatuses)[number];
export type PaymentMethod = (typeof paymentMethods)[number];
