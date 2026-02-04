export enum UserRoles {
    STUDENT = "STUDENT",
    TUTOR = "TUTOR",
    ADMIN = "ADMIN",
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    BAN = "BAN",
}

export enum Days {
    SATURDAY = "SATURDAY",
    SUNDAY = "SUNDAY",
    MONDAY = "MONDAY",
    TUESDAY = "TUESDAY",
    WEDNESDAY = "WEDNESDAY",
    THURSDAY = "THURSDAY",
    FRIDAY = "FRIDAY",
}

export enum BookingStatus {
    CONFIRMED = "CONFIRMED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}

export interface Subject {
    subject_id: string;
    name: string;
    description?: string;
}

export interface Availability {
    availability_id: string;
    tutor_profile_id: string;
    day_of_week: Days;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
}

export interface TutorSubject {
    tutor_profile_id: string;
    subject_id: string;
    subject: Subject;
}

export interface Review {
    review_id: string;
    booking_id: string;
    tutor_profile_id: string;
    student_id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    student?: Pick<User, "id" | "name" | "email" | "image">;
}

export interface Booking {
    booking_id: string;
    student_id: string;
    tutor_profile_id: string;
    subject_id: string;
    day_of_week: Days;
    start_time: string;
    end_time: string;
    status: BookingStatus;
    price: number;
    meeting_link: string | null;
    created_at: string;
    updated_at: string;
    student?: Pick<User, "id" | "name" | "email" | "image">;
    subject?: Subject;
}

export interface TutorProfile {
    tutor_profile_id: string;
    hourly_rate: number;
    year_of_experience: number;
    avg_rating: number;
    tutor_id: string;
    created_at: string;
    updated_at: string;
    availabilities?: Availability[];
    tutorSubjects?: TutorSubject[];
    reviews?: Review[];
    bookings?: Booking[];
}

export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    role: UserRoles;
    phone: string | null;
    status: UserStatus;
    tutorProfiles?: TutorProfile | null;
    bookings?: Booking[];
    reviews?: Review[];
}
