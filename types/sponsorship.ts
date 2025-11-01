// Sponsorship Types
export interface SponsorshipForm {
  id: number;
  eventName: string;
  eventDescription: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  benefits: string[];
  tiers: SponsorshipTier[];
  createdAt: string;
  status: 'active' | 'closed' | 'draft';
}

export interface SponsorshipTier {
  id: number;
  name: string;
  amount: number;
  benefits: string[];
}

export interface Sponsor {
  id: number;
  formId: number;
  name: string;
  type: 'company' | 'individual';
  email: string;
  phone?: string;
  amount: number;
  tierId?: number;
  message?: string;
  sponsoredAt: string;
  status: 'pending' | 'confirmed' | 'rejected';
}

export interface SponsorshipFormData {
  eventName: string;
  eventDescription: string;
  targetAmount: number;
  deadline: string;
  benefits: string[];
  tiers: Omit<SponsorshipTier, 'id'>[];
}

export interface SponsorSubmission {
  formId: number;
  name: string;
  type: 'company' | 'individual';
  email: string;
  phone?: string;
  amount: number;
  tierId?: number;
  message?: string;
}
