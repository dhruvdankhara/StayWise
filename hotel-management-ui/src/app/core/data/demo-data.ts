import type {
  Booking,
  MetricCard,
  ReviewItem,
  Room,
  SessionUser,
  TaskItem,
  UserRole
} from '../models/app.models';

export const demoUsers: SessionUser[] = [
  {
    id: 'u-admin',
    name: 'Aarav Mehta',
    email: 'admin@staywise.com',
    phone: '9876500001',
    role: 'admin'
  },
  {
    id: 'u-manager',
    name: 'Naina Kapoor',
    email: 'manager@staywise.com',
    phone: '9876500002',
    role: 'hotel_manager'
  },
  {
    id: 'u-reception',
    name: 'Rohit Sharma',
    email: 'reception@staywise.com',
    phone: '9876500003',
    role: 'receptionist'
  },
  {
    id: 'u-cleaning',
    name: 'Pooja Singh',
    email: 'cleaning@staywise.com',
    phone: '9876500004',
    role: 'cleaning_staff'
  },
  {
    id: 'u-guest',
    name: 'Ishita Verma',
    email: 'guest@staywise.com',
    phone: '9876500005',
    role: 'guest'
  }
];

export const demoRooms: Room[] = [
  {
    id: 'r-101',
    roomNumber: '101',
    type: 'Single Retreat',
    floor: 1,
    capacity: 1,
    rate: 4500,
    status: 'available',
    amenities: ['Breakfast', 'Fast Wi-Fi', 'Smart TV'],
    description: 'A calm city-view room designed for solo business and leisure stays.'
  },
  {
    id: 'r-204',
    roomNumber: '204',
    type: 'Deluxe Horizon',
    floor: 2,
    capacity: 2,
    rate: 7200,
    status: 'occupied',
    amenities: ['Bathtub', 'Workspace', 'King Bed'],
    description: 'A generous deluxe suite with lounge seating and warm ambient lighting.'
  },
  {
    id: 'r-305',
    roomNumber: '305',
    type: 'Signature Suite',
    floor: 3,
    capacity: 4,
    rate: 12000,
    status: 'available',
    amenities: ['Living Room', 'Mini Bar', 'Concierge'],
    description: 'An expansive suite for families, celebrations, and long-form premium stays.'
  }
];

export const demoBookings: Booking[] = [
  {
    id: 'b-1',
    ref: 'SW-AX91',
    guestName: 'Ishita Verma',
    roomNumber: '204',
    roomType: 'Deluxe Horizon',
    checkIn: '2026-03-16',
    checkOut: '2026-03-18',
    status: 'confirmed',
    amount: 14400
  },
  {
    id: 'b-2',
    ref: 'SW-LM52',
    guestName: 'Kabir Nanda',
    roomNumber: '305',
    roomType: 'Signature Suite',
    checkIn: '2026-03-20',
    checkOut: '2026-03-23',
    status: 'pending',
    amount: 36000
  },
  {
    id: 'b-3',
    ref: 'SW-RQ18',
    guestName: 'Maya Rao',
    roomNumber: '101',
    roomType: 'Single Retreat',
    checkIn: '2026-03-14',
    checkOut: '2026-03-15',
    status: 'checked_in',
    amount: 4500
  }
];

export const demoTasks: TaskItem[] = [
  {
    id: 't-1',
    roomNumber: '101',
    priority: 'normal',
    status: 'pending',
    assignee: 'Pooja Singh',
    note: 'Prepare room for early arrival.'
  },
  {
    id: 't-2',
    roomNumber: '204',
    priority: 'urgent',
    status: 'in_progress',
    assignee: 'Pooja Singh',
    note: 'Checkout turnover with minibar reconciliation.'
  }
];

export const demoReviews: ReviewItem[] = [
  {
    id: 'rv-1',
    guestName: 'Ishita Verma',
    roomType: 'Single Retreat',
    rating: 5,
    comment: 'Elegant interiors and exceptionally attentive front-desk service.'
  },
  {
    id: 'rv-2',
    guestName: 'Kabir Nanda',
    roomType: 'Deluxe Horizon',
    rating: 4,
    comment: 'Great work desk and breakfast spread, with quick housekeeping response.'
  }
];

export const roleMetrics: Record<UserRole, MetricCard[]> = {
  admin: [
    { label: 'Occupancy Rate', value: '82%', change: '+6.2% vs last week' },
    { label: 'Today\'s Revenue', value: '₹2.48L', change: '+14 walk-in upsells' },
    { label: 'Active Staff', value: '26', change: '3 on evening shift' }
  ],
  hotel_manager: [
    { label: 'Arrivals Today', value: '18', change: '5 VIP guests' },
    { label: 'Housekeeping SLA', value: '94%', change: '2 rooms pending' },
    { label: 'Revenue Target', value: '89%', change: 'On track for weekend' }
  ],
  receptionist: [
    { label: 'Arrivals', value: '18', change: '6 before 2 PM' },
    { label: 'Departures', value: '11', change: '3 late checkout requests' },
    { label: 'Pending Bills', value: '₹58,200', change: '4 folios to settle' }
  ],
  cleaning_staff: [
    { label: 'Assigned Rooms', value: '8', change: '2 urgent turnovers' },
    { label: 'Completed', value: '5', change: 'Ahead of shift target' },
    { label: 'Supplies Alerts', value: '1', change: 'Floor 3 linen restock' }
  ],
  guest: [
    { label: 'Upcoming Stay', value: 'Deluxe Horizon', change: 'Check-in on 16 Mar' },
    { label: 'Loyalty Tier', value: 'Silver', change: '2 stays away from Gold' },
    { label: 'Saved Requests', value: '3', change: 'Late check-in, high floor' }
  ]
};

export const roleHeadlines: Record<UserRole, string> = {
  admin: 'Control centre for staffing, occupancy, revenue, and system health.',
  hotel_manager: 'Day-to-day operations, floor readiness, and service recovery at a glance.',
  receptionist: 'Front-desk workflow for arrivals, departures, billing, and guest care.',
  cleaning_staff: 'Task-first workspace with priorities, notes, and completion flow.',
  guest: 'Personal stay hub for bookings, preferences, invoices, and reviews.'
};
