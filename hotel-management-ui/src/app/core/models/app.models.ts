export type UserRole = 'admin' | 'receptionist' | 'cleaning_staff' | 'guest';
export type BookingPaymentMethod = 'cash' | 'online';

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  details?: unknown;
  errors?: unknown;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified?: boolean;
  isActive?: boolean;
  profileImage?: string;
  preferences?: Record<string, unknown>;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
}

export interface RoomListItem {
  id: string;
  roomNumber: string;
  type: string;
  floor: number;
  capacity: number;
  baseRate: number;
  status: string;
  amenities: string[];
  images: string[];
  description?: string;
  isActive?: boolean;
}

export interface BookingGuestSummary {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface BookingRoomSummary {
  id: string;
  roomNumber: string;
  type: string;
  floor?: number;
  capacity?: number;
  baseRate?: number;
  images?: string[];
}

export interface BookingListItem {
  id: string;
  bookingRef: string;
  checkIn: string;
  checkOut: string;
  actualCheckIn?: string;
  actualCheckOut?: string;
  guests: number;
  status: string;
  paymentMethod?: BookingPaymentMethod;
  totalAmount: number;
  paymentStatus: string;
  specialRequests?: string;
  cancellationReason?: string;
  guest?: BookingGuestSummary;
  room?: BookingRoomSummary;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  bookingId: string;
  guestId: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  discount: number;
  discountReason?: string;
  total: number;
  paidAmount: number;
  pdfUrl?: string;
  issuedAt?: string;
}

export interface HousekeepingTask {
  id: string;
  priority: string;
  status: string;
  notes?: string;
  scheduledFor: string;
  startedAt?: string;
  completedAt?: string;
  room?: BookingRoomSummary;
  assignedTo?: BookingGuestSummary;
  assignedBy?: BookingGuestSummary;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  isVisible: boolean;
  guest?: BookingGuestSummary;
  room?: BookingRoomSummary;
}

export interface HotelSettings {
  id?: string;
  name: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl?: string;
  invoiceFooter: string;
  currency: string;
  checkInTime: string;
  checkOutTime: string;
}

export interface UploadResult {
  url: string;
  filename?: string;
  size?: number;
}

export interface CreateOnlineOrderPayload {
  guestId?: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
}

export interface OnlineOrderResult {
  sessionId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyOnlinePaymentPayload {
  sessionId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface MetricCard {
  label: string;
  value: string;
  hint: string;
}

export type ReportRow = Record<string, string | number | boolean | null | undefined>;
