import type {
  BookingGuestSummary,
  BookingListItem,
  BookingRoomSummary,
  HotelSettings,
  HousekeepingTask,
  Invoice,
  Review,
  RoomListItem,
  UploadResult,
  UserProfile
} from './app.models';

const getId = (value: Record<string, unknown>): string =>
  String(value['id'] ?? value['_id'] ?? '');

export const mapUserProfile = (value: Record<string, unknown>): UserProfile => ({
  id: getId(value),
  name: String(value['name'] ?? ''),
  email: String(value['email'] ?? ''),
  phone: value['phone'] ? String(value['phone']) : undefined,
  role: String(value['role'] ?? 'guest') as UserProfile['role'],
  isVerified: value['isVerified'] ? Boolean(value['isVerified']) : undefined,
  isActive: value['isActive'] !== undefined ? Boolean(value['isActive']) : undefined,
  profileImage: value['profileImage'] ? String(value['profileImage']) : undefined,
  preferences:
    value['preferences'] && typeof value['preferences'] === 'object'
      ? (value['preferences'] as Record<string, unknown>)
      : undefined
});

export const mapRoomSummary = (value: Record<string, unknown>): BookingRoomSummary => ({
  id: getId(value),
  roomNumber: String(value['roomNumber'] ?? ''),
  type: String(value['type'] ?? ''),
  floor: value['floor'] !== undefined ? Number(value['floor']) : undefined,
  capacity: value['capacity'] !== undefined ? Number(value['capacity']) : undefined,
  baseRate: value['baseRate'] !== undefined ? Number(value['baseRate']) : undefined,
  images: Array.isArray(value['images']) ? value['images'].map((item) => String(item)) : undefined
});

export const mapGuestSummary = (value: Record<string, unknown>): BookingGuestSummary => ({
  id: getId(value),
  name: String(value['name'] ?? ''),
  email: value['email'] ? String(value['email']) : undefined,
  phone: value['phone'] ? String(value['phone']) : undefined
});

export const mapRoom = (value: Record<string, unknown>): RoomListItem => ({
  id: getId(value),
  roomNumber: String(value['roomNumber'] ?? ''),
  type: String(value['type'] ?? ''),
  floor: Number(value['floor'] ?? 0),
  capacity: Number(value['capacity'] ?? 0),
  baseRate: Number(value['baseRate'] ?? 0),
  status: String(value['status'] ?? ''),
  amenities: Array.isArray(value['amenities']) ? value['amenities'].map((item) => String(item)) : [],
  images: Array.isArray(value['images']) ? value['images'].map((item) => String(item)) : [],
  description: value['description'] ? String(value['description']) : undefined,
  isActive: value['isActive'] !== undefined ? Boolean(value['isActive']) : undefined
});

export const mapBooking = (value: Record<string, unknown>): BookingListItem => ({
  id: getId(value),
  bookingRef: String(value['bookingRef'] ?? ''),
  checkIn: String(value['checkIn'] ?? ''),
  checkOut: String(value['checkOut'] ?? ''),
  actualCheckIn: value['actualCheckIn'] ? String(value['actualCheckIn']) : undefined,
  actualCheckOut: value['actualCheckOut'] ? String(value['actualCheckOut']) : undefined,
  guests: Number(value['guests'] ?? 0),
  status: String(value['status'] ?? ''),
  totalAmount: Number(value['totalAmount'] ?? 0),
  paymentStatus: String(value['paymentStatus'] ?? ''),
  specialRequests: value['specialRequests'] ? String(value['specialRequests']) : undefined,
  cancellationReason: value['cancellationReason'] ? String(value['cancellationReason']) : undefined,
  guest:
    value['guest'] && typeof value['guest'] === 'object'
      ? mapGuestSummary(value['guest'] as Record<string, unknown>)
      : undefined,
  room:
    value['room'] && typeof value['room'] === 'object'
      ? mapRoomSummary(value['room'] as Record<string, unknown>)
      : undefined
});

export const mapInvoice = (value: Record<string, unknown>): Invoice => ({
  id: getId(value),
  bookingId: String(value['booking'] ?? ''),
  guestId: String(value['guest'] ?? ''),
  lineItems: Array.isArray(value['lineItems'])
    ? value['lineItems'].map((item) => ({
        description: String((item as Record<string, unknown>)['description'] ?? ''),
        quantity: Number((item as Record<string, unknown>)['quantity'] ?? 0),
        unitPrice: Number((item as Record<string, unknown>)['unitPrice'] ?? 0),
        total: Number((item as Record<string, unknown>)['total'] ?? 0)
      }))
    : [],
  subtotal: Number(value['subtotal'] ?? 0),
  taxRate: Number(value['taxRate'] ?? 0),
  taxAmount: Number(value['taxAmount'] ?? 0),
  discount: Number(value['discount'] ?? 0),
  discountReason: value['discountReason'] ? String(value['discountReason']) : undefined,
  total: Number(value['total'] ?? 0),
  paidAmount: Number(value['paidAmount'] ?? 0),
  pdfUrl: value['pdfUrl'] ? String(value['pdfUrl']) : undefined,
  issuedAt: value['issuedAt'] ? String(value['issuedAt']) : undefined
});

export const mapTask = (value: Record<string, unknown>): HousekeepingTask => ({
  id: getId(value),
  priority: String(value['priority'] ?? ''),
  status: String(value['status'] ?? ''),
  notes: value['notes'] ? String(value['notes']) : undefined,
  scheduledFor: String(value['scheduledFor'] ?? ''),
  startedAt: value['startedAt'] ? String(value['startedAt']) : undefined,
  completedAt: value['completedAt'] ? String(value['completedAt']) : undefined,
  room:
    value['room'] && typeof value['room'] === 'object'
      ? mapRoomSummary(value['room'] as Record<string, unknown>)
      : undefined,
  assignedTo:
    value['assignedTo'] && typeof value['assignedTo'] === 'object'
      ? mapGuestSummary(value['assignedTo'] as Record<string, unknown>)
      : undefined,
  assignedBy:
    value['assignedBy'] && typeof value['assignedBy'] === 'object'
      ? mapGuestSummary(value['assignedBy'] as Record<string, unknown>)
      : undefined
});

export const mapReview = (value: Record<string, unknown>): Review => ({
  id: getId(value),
  rating: Number(value['rating'] ?? 0),
  comment: value['comment'] ? String(value['comment']) : undefined,
  isVisible: Boolean(value['isVisible']),
  guest:
    value['guest'] && typeof value['guest'] === 'object'
      ? mapGuestSummary(value['guest'] as Record<string, unknown>)
      : undefined,
  room:
    value['room'] && typeof value['room'] === 'object'
      ? mapRoomSummary(value['room'] as Record<string, unknown>)
      : undefined
});

export const mapSettings = (value: Record<string, unknown>): HotelSettings => ({
  id: value['_id'] ? String(value['_id']) : undefined,
  name: String(value['name'] ?? ''),
  address: String(value['address'] ?? ''),
  contactEmail: String(value['contactEmail'] ?? ''),
  contactPhone: String(value['contactPhone'] ?? ''),
  logoUrl: value['logoUrl'] ? String(value['logoUrl']) : undefined,
  invoiceFooter: String(value['invoiceFooter'] ?? ''),
  taxRate: Number(value['taxRate'] ?? 0),
  currency: String(value['currency'] ?? 'INR'),
  checkInTime: String(value['checkInTime'] ?? ''),
  checkOutTime: String(value['checkOutTime'] ?? '')
});

export const mapUploadResult = (value: Record<string, unknown>): UploadResult => ({
  url: String(value['url'] ?? ''),
  filename: value['filename'] ? String(value['filename']) : undefined,
  size: value['size'] !== undefined ? Number(value['size']) : undefined
});
