export enum UserRoles {
    STUDENT = "STUDENT",
    TUTOR = "TUTOR",
    ADMIN = "ADMIN",
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    BAN = "BAN",
}

export interface TutorProfile {
    tutor_profile_id: string;
    hourly_rate: number;
    year_of_experience: number;
    avg_rating: number;
    tutor_id: string;
    created_at: string;
    updated_at: string;
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
}
