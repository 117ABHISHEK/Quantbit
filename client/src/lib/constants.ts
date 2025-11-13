export const QUERY_KEYS = {
  machines: ['/api/machines'] as const,
  machine: (id: string) => ['/api/machines', id] as const,
  maintenanceLogs: (machineId?: string) => 
    machineId ? ['/api/maintenance', machineId] as const : ['/api/maintenance'] as const,
  overdueModules: ['/api/maintenance/overdue'] as const,
} as const;

export const STATUS_CONFIG = {
  OK: {
    label: 'OK',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: 'CheckCircle2',
    textColor: 'text-status-ok',
  },
  'Due Soon': {
    label: 'Due Soon',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: 'Clock',
    textColor: 'text-status-dueSoon',
  },
  Overdue: {
    label: 'Overdue',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: 'AlertCircle',
    textColor: 'text-status-overdue',
  },
} as const;
