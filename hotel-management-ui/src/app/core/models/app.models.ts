export type UserRole = 'admin' | 'hotel_manager' | 'receptionist' | 'cleaning_staff' | 'guest';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
}

export interface MetricCard {
  label: string;
  value: string;
  change: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  type: string;
  floor: number;
  capacity: number;
  rate: number;
  status: string;
  amenities: string[];
  description: string;
}

export interface Booking {
  id: string;
  ref: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: string;
  amount: number;
}

export interface TaskItem {
  id: string;
  roomNumber: string;
  priority: string;
  status: string;
  assignee: string;
  note: string;
}

export interface ReviewItem {
  id: string;
  guestName: string;
  roomType: string;
  rating: number;
  comment: string;
}

export interface NavItem {
  label: string;
  path: string;
}
