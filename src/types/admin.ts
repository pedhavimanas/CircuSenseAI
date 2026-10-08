import { UserRole } from './index';
import { HealthResponse, ModelInfoResponse } from '../services/detectionApi';

/**
 * Subscription tiers available for simulated billing and licensing
 */
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

/**
 * User account status within platform administration
 */
export type UserAccountStatus = 'active' | 'suspended' | 'invited' | 'pending';

/**
 * Admin view representation of a platform user account.
 * Note: In this academic prototype, user management is simulated via client-side fixtures.
 */
export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title?: string;
  department?: string;
  plan: SubscriptionTier;
  tier: SubscriptionTier;
  status: UserAccountStatus;
  joinedAt: string;
  scansCount: number;
  lastActiveAt: string;
}

/**
 * Transaction processing statuses
 */
export type TransactionStatus = 'succeeded' | 'pending' | 'failed' | 'refunded';

/**
 * Simulated platform billing transaction record.
 * MANDATORY: All financial records in this prototype are SIMULATED DEMO DATA.
 */
export interface TransactionRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: SubscriptionTier;
  tier: SubscriptionTier;
  amount: number;
  currency: 'USD' | 'EUR' | 'GBP';
  status: TransactionStatus;
  date: string;
  type?: 'subscription' | 'one_time' | 'refund';
  billingCycle: 'monthly' | 'annual';
  invoiceNumber: string;
  paymentMethod: string;
}

/**
 * Aggregated platform financial overview.
 * MANDATORY: isSimulated flag must always be true in this prototype.
 */
export interface FinancialSummary {
  /** Explicit verification flag confirming this dataset is simulated and not real production payments */
  readonly isSimulated: true;
  currency: 'USD';
  totalRevenue: number;
  monthlyRevenue: number;
  monthlyRecurringRevenue: number;
  annualRunRate: number;
  averageRevenuePerUser: number;
  transactionCount: number;
  successfulTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  planDistribution: {
    free: number;
    pro: number;
    enterprise: number;
  };
  monthlyTrend: {
    month: string;
    revenue: number;
    transactions: number;
  }[];
}

/**
 * Aggregate optical inspection and YOLO detection usage metrics
 */
export interface AdminUsageMetrics {
  totalScans: number;
  scansToday: number;
  averageInferenceLatency: number;
  averageInferenceLatencyMs: number;
  totalDetections: number;
  totalDetectionsCount: number;
  defectFlagRatePercentage: number;
  mostDetectedComponents: {
    className: string;
    count: number;
    percentage: number;
  }[];
  topDetectedClasses: {
    className: string;
    count: number;
    percentage: number;
  }[];
  scansBySource: {
    liveUploads: number;
    benchmarkPresets: number;
  };
}

/**
 * System and computer vision runtime telemetry envelope.
 * Combines real FastAPI/YOLO data with environment health.
 */
export interface AdminSystemTelemetry {
  apiStatus: 'online' | 'degraded' | 'offline';
  modelLoaded: boolean;
  modelName: string;
  modelClassCount: number;
  device: string;
  ocrStatus: 'available' | 'offline';
  health: HealthResponse | null;
  modelInfo: ModelInfoResponse | null;
  checkedAt: string;
  backendHost: string;
  inferenceDevice: string;
  ocrEngine: {
    status: 'available' | 'offline';
    provider: string;
  };
}

/**
 * Administrative workspace navigation tabs
 */
export type AdminTab = 
  | 'overview' 
  | 'users' 
  | 'finance' 
  | 'usage' 
  | 'system' 
  | 'settings';
