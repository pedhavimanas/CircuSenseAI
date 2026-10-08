import { 
  AdminUserRecord, 
  TransactionRecord, 
  FinancialSummary, 
  AdminUsageMetrics 
} from '../types/admin';

/**
 * MANDATORY FINANCIAL & TELEMETRY CLASSIFICATION NOTICE:
 * 
 * 1. SIMULATED / DEMO DATA:
 *    - All users, subscription plans, transactions, MRR, and revenue figures below
 *      are FICTIONAL DEMO FIXTURES created for educational prototype evaluation.
 *    - CircuSense AI does NOT possess a production payment gateway, card processor,
 *      or live commercial billing infrastructure.
 * 
 * 2. REAL TELEMETRY (To be fetched dynamically in Admin System view):
 *    - FastAPI server connectivity (/api/health)
 *    - YOLO model state (best.pt, 22 classes from /api/model-info)
 *    - Hardware device attribution (CPU / CUDA)
 *    - Real scan latency from executed client analysis sessions
 */
export const DEMO_FINANCE_NOTICE = 
  'SIMULATED TELEMETRY: All financial metrics, transaction histories, and user accounts below are simulated fixtures for academic prototype demonstration. No actual monetary transactions or payment processing occurred.';

/**
 * Curated list of simulated engineering user accounts
 */
export const MOCK_ADMIN_USERS: AdminUserRecord[] = [
  {
    id: 'usr-admin-demo-01',
    name: 'Dr. Sarah Vance',
    email: 'admin@circusense.ai',
    role: 'admin',
    title: 'Platform Director',
    department: 'Executive Engineering Leadership',
    plan: 'enterprise',
    tier: 'enterprise',
    status: 'active',
    joinedAt: '2026-01-15',
    scansCount: 142,
    lastActiveAt: '2026-10-08 22:45'
  },
  {
    id: 'usr-demo-01',
    name: 'Alex Chen',
    email: 'alex.chen@circusense.ai',
    role: 'user',
    title: 'Lead Circuit Systems Engineer',
    department: 'Hardware Diagnostics Lab',
    plan: 'pro',
    tier: 'pro',
    status: 'active',
    joinedAt: '2026-02-10',
    scansCount: 98,
    lastActiveAt: '2026-10-08 22:30'
  },
  {
    id: 'usr-003',
    name: 'Elena Rostova',
    email: 'elena.rostova@circusense.ai',
    role: 'user',
    title: 'Senior Hardware Diagnostic Engineer',
    department: 'Quality Assurance & Failure Analysis',
    plan: 'pro',
    tier: 'pro',
    status: 'active',
    joinedAt: '2026-03-01',
    scansCount: 64,
    lastActiveAt: '2026-10-08 19:15'
  },
  {
    id: 'usr-004',
    name: 'Marcus Brody',
    email: 'marcus.brody@aeropower.tech',
    role: 'user',
    title: 'Avionics Quality Inspector',
    department: 'Aerospace Systems Testing',
    plan: 'enterprise',
    tier: 'enterprise',
    status: 'active',
    joinedAt: '2026-03-18',
    scansCount: 215,
    lastActiveAt: '2026-10-08 16:40'
  },
  {
    id: 'usr-005',
    name: 'Priya Patel',
    email: 'p.patel@embeddedlabs.io',
    role: 'user',
    title: 'SMT Assembly Verification Lead',
    department: 'Manufacturing Yield Engineering',
    plan: 'pro',
    tier: 'pro',
    status: 'active',
    joinedAt: '2026-04-22',
    scansCount: 47,
    lastActiveAt: '2026-10-07 14:10'
  },
  {
    id: 'usr-006',
    name: 'David Kim',
    email: 'david.kim@robotics-ai.kr',
    role: 'user',
    title: 'Robotics Hardware Architect',
    department: 'Embedded Autonomy Group',
    plan: 'enterprise',
    tier: 'enterprise',
    status: 'active',
    joinedAt: '2026-05-14',
    scansCount: 112,
    lastActiveAt: '2026-10-06 11:25'
  },
  {
    id: 'usr-007',
    name: 'Chloe Dubois',
    email: 'chloe@du-automotive.fr',
    role: 'user',
    title: 'ECU Reliability Engineer',
    department: 'Powertrain Electronics Testing',
    plan: 'free',
    tier: 'free',
    status: 'active',
    joinedAt: '2026-07-03',
    scansCount: 12,
    lastActiveAt: '2026-10-04 09:50'
  },
  {
    id: 'usr-008',
    name: 'Viktor Novak',
    email: 'viktor.n@sensornet.eu',
    role: 'user',
    title: 'IoT Hardware Prototyper',
    department: 'Industrial Telemetry Prototyping',
    plan: 'free',
    tier: 'free',
    status: 'invited',
    joinedAt: '2026-09-28',
    scansCount: 0,
    lastActiveAt: 'Never'
  }
];

/**
 * Curated list of simulated billing transactions (clearly fictional)
 */
export const MOCK_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-2026-1001',
    userId: 'usr-004',
    userName: 'Marcus Brody',
    userEmail: 'marcus.brody@aeropower.tech',
    plan: 'enterprise',
    tier: 'enterprise',
    amount: 2990,
    currency: 'USD',
    status: 'succeeded',
    date: '2026-10-01 10:14',
    type: 'subscription',
    billingCycle: 'annual',
    invoiceNumber: 'INV-2026-0891',
    paymentMethod: 'Corporate ACH (Simulated)'
  },
  {
    id: 'tx-2026-1002',
    userId: 'usr-006',
    userName: 'David Kim',
    userEmail: 'david.kim@robotics-ai.kr',
    plan: 'enterprise',
    tier: 'enterprise',
    amount: 299,
    currency: 'USD',
    status: 'succeeded',
    date: '2026-10-02 04:30',
    type: 'subscription',
    billingCycle: 'monthly',
    invoiceNumber: 'INV-2026-0892',
    paymentMethod: 'Visa •••• 4022 (Simulated)'
  },
  {
    id: 'tx-2026-1003',
    userId: 'usr-demo-01',
    userName: 'Alex Chen',
    userEmail: 'alex.chen@circusense.ai',
    plan: 'pro',
    tier: 'pro',
    amount: 49,
    currency: 'USD',
    status: 'succeeded',
    date: '2026-10-03 14:22',
    type: 'subscription',
    billingCycle: 'monthly',
    invoiceNumber: 'INV-2026-0893',
    paymentMethod: 'Mastercard •••• 8812 (Simulated)'
  },
  {
    id: 'tx-2026-1004',
    userId: 'usr-003',
    userName: 'Elena Rostova',
    userEmail: 'elena.rostova@circusense.ai',
    plan: 'pro',
    tier: 'pro',
    amount: 49,
    currency: 'USD',
    status: 'succeeded',
    date: '2026-10-04 09:12',
    type: 'subscription',
    billingCycle: 'monthly',
    invoiceNumber: 'INV-2026-0894',
    paymentMethod: 'Amex •••• 3011 (Simulated)'
  },
  {
    id: 'tx-2026-1005',
    userId: 'usr-005',
    userName: 'Priya Patel',
    userEmail: 'p.patel@embeddedlabs.io',
    plan: 'pro',
    tier: 'pro',
    amount: 49,
    currency: 'USD',
    status: 'succeeded',
    date: '2026-10-05 17:05',
    type: 'subscription',
    billingCycle: 'monthly',
    invoiceNumber: 'INV-2026-0895',
    paymentMethod: 'Visa •••• 7190 (Simulated)'
  },
  {
    id: 'tx-2026-1006',
    userId: 'usr-admin-demo-01',
    userName: 'Dr. Sarah Vance',
    userEmail: 'admin@circusense.ai',
    plan: 'enterprise',
    tier: 'enterprise',
    amount: 299,
    currency: 'USD',
    status: 'succeeded',
    date: '2026-10-06 11:00',
    type: 'subscription',
    billingCycle: 'monthly',
    invoiceNumber: 'INV-2026-0896',
    paymentMethod: 'Corporate Wire (Simulated)'
  },
  {
    id: 'tx-2026-1007',
    userId: 'usr-007',
    userName: 'Chloe Dubois',
    userEmail: 'chloe@du-automotive.fr',
    plan: 'pro',
    tier: 'pro',
    amount: 49,
    currency: 'USD',
    status: 'pending',
    date: '2026-10-07 18:45',
    type: 'subscription',
    billingCycle: 'monthly',
    invoiceNumber: 'INV-2026-0897',
    paymentMethod: 'SEPA Direct (Simulated)'
  },
  {
    id: 'tx-2026-1008',
    userId: 'usr-008',
    userName: 'Viktor Novak',
    userEmail: 'viktor.n@sensornet.eu',
    plan: 'pro',
    tier: 'pro',
    amount: 49,
    currency: 'USD',
    status: 'failed',
    date: '2026-10-08 08:30',
    type: 'subscription',
    billingCycle: 'monthly',
    invoiceNumber: 'INV-2026-0898',
    paymentMethod: 'Visa •••• 9921 (Simulated)'
  }
];

/**
 * Aggregated simulated financial KPI summary
 */
export const MOCK_FINANCIAL_SUMMARY: FinancialSummary = {
  isSimulated: true,
  currency: 'USD',
  totalRevenue: 28450,
  monthlyRevenue: 4890,
  monthlyRecurringRevenue: 4890,
  annualRunRate: 58680,
  averageRevenuePerUser: 78.50,
  transactionCount: 38,
  successfulTransactions: 36,
  pendingTransactions: 1,
  failedTransactions: 1,
  planDistribution: {
    free: 14,
    pro: 18,
    enterprise: 6
  },
  monthlyTrend: [
    { month: 'May 2026', revenue: 3200, transactions: 18 },
    { month: 'Jun 2026', revenue: 3650, transactions: 22 },
    { month: 'Jul 2026', revenue: 4100, transactions: 27 },
    { month: 'Aug 2026', revenue: 4420, transactions: 31 },
    { month: 'Sep 2026', revenue: 4750, transactions: 35 },
    { month: 'Oct 2026 (MTD)', revenue: 4890, transactions: 38 }
  ]
};

/**
 * Direct alias for financial data, clearly marked as simulated
 */
export const DEMO_FINANCE_DATA = MOCK_FINANCIAL_SUMMARY;

/**
 * Simulated platform-wide hardware inspection usage metrics
 */
export const MOCK_USAGE_SUMMARY: AdminUsageMetrics = {
  totalScans: 840,
  scansToday: 23,
  averageInferenceLatency: 148,
  averageInferenceLatencyMs: 148,
  totalDetections: 12450,
  totalDetectionsCount: 12450,
  defectFlagRatePercentage: 4.8,
  mostDetectedComponents: [
    { className: 'capacitor', count: 4820, percentage: 38.7 },
    { className: 'resistor', count: 4210, percentage: 33.8 },
    { className: 'ic', count: 1490, percentage: 12.0 },
    { className: 'connector', count: 760, percentage: 6.1 },
    { className: 'diode', count: 620, percentage: 5.0 },
    { className: 'other passives', count: 550, percentage: 4.4 }
  ],
  topDetectedClasses: [
    { className: 'capacitor', count: 4820, percentage: 38.7 },
    { className: 'resistor', count: 4210, percentage: 33.8 },
    { className: 'ic', count: 1490, percentage: 12.0 },
    { className: 'connector', count: 760, percentage: 6.1 },
    { className: 'diode', count: 620, percentage: 5.0 },
    { className: 'other passives', count: 550, percentage: 4.4 }
  ],
  scansBySource: {
    liveUploads: 512,
    benchmarkPresets: 328
  }
};
