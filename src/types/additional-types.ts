import { AvailablePositionPayload, AvailablePositionWithPositionApplied, CompanyGetPayload, UserGetPayload } from "@/types/entity.relations";

export type CompanyStats = {
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  totalApplications: number;
  recentJobs: Array<{
    id: string;
    positionName: string;
    status: "OPEN" | "CLOSED";
    createdAt: Date;
  }>;
};

export interface CompanyProfileClientProps {
  company: CompanyGetPayload;
  stats: CompanyStats;
  searchParams: {
    q?: string;
    location?: string;
    sort?: "newest" | "salary_high" | "salary_low" | "deadline";
    page?: string;
    tab?: "overview" | "jobs" | "about";
    jobStatus?: "OPEN" | "CLOSED";
  };
}

export interface CompaniesPageClientProps {
  companies: CompanyGetPayload[];
  totalCompanies: number;
  types: string[];
  locations: string[];
  currentPage: number;
  pageSize: number;
  searchParams: {
    q?: string;
    type?: string;
    location?: string;
    sort?: "newest" | "most_jobs" | "alphabetical";
    page?: string;
  };
}

export interface JobsPageClientProps {
  jobs: AvailablePositionPayload[];
  totalJobs: number;
  locations: string[];
  currentPage: number;
  pageSize: number;
  searchParams: {
    q?: string;
    status?: "OPEN" | "CLOSED";
    salaryMin?: string;
    salaryMax?: string;
    location?: string;
    sort?: "newest" | "salary_high" | "salary_low" | "deadline";
    page?: string;
  };
}

export type SimilarJob = {
  id: string;
  positionName: string;
  salaryStartRange: number | null;
  salaryEndRange: number | null;
  status: "OPEN" | "CLOSED";
  submissionEndDate: Date;
  createdAt: Date;
  Company: {
    name: string;
  } | null;
  _count: {
    positionApplied: number;
  };
};

export interface JobDetailClientProps {
  job: AvailablePositionWithPositionApplied;
  similarJobs: SimilarJob[];
  userData?: UserGetPayload | null;
  stats: {
    totalApplications: number;
    recentApplications: AvailablePositionWithPositionApplied["positionApplied"];
    daysRemaining: number;
  };
}
