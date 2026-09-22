export type FactorStatus = 'VALID' | 'REGIME_SHIFT' | 'INVALID' | 'OBSERVE' | 'NO_GENE';
export type StabilityArchetype = 
  | 'GLOBAL_FAILURE' 
  | 'WEAK_VALIDATION_ALPHA' 
  | 'MIXED_FAILURE' 
  | 'REGIME_DEPENDENT_ALPHA' 
  | 'VALIDATION_ALPHA_BUT_UNSTABLE';

export interface FactorMetric {
  name: string;
  category: 'volatility' | 'money_flow' | 'microstructure' | 'trend' | 'entropy' | 'prediction';
  ic_mean: number;
  icir: number;
  ic_win_rate: number;
  t_stat: number;
  // Multi-horizon IC
  ic_ret_day: number;
  ic_ret_swing: number;
  ic_ret_fortnight: number;
  ic_ret_month: number;
  // Newey-West HAC
  icir_nw?: number;
  t_stat_nw?: number;
  best_horizon?: string;
  // Monotonicity
  monotonic_score?: number;
  monotonic_dir?: 'Increasing' | 'Decreasing' | 'None';
  monotonic_target?: string;
  // Modeling metrics
  rf_importance?: number;
  elastic_coef?: number;
  importance_score?: number;
  // Gene validation & stability
  gene_status?: FactorStatus;
  threshold?: number;
  direction?: '<=' | '>=' | 'None';
  validation_ic?: number;
  stability_score?: number;
  positive_fold_ratio?: number;
  ic_retention?: number;
  stability_archetype?: StabilityArchetype;
  primary_cause?: string;
  is_selected_in_genome?: boolean;
  is_inverted?: boolean;
}

export interface CorrelationPair {
  factorA: string;
  factorB: string;
  correlation: number;
  impactLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface PipelineStageInfo {
  id: string;
  name: string;
  status: 'PASS' | 'WARNING' | 'REJECT';
  durationSec: number;
  keyArtifact: string;
  warningNote?: string;
}

export interface CriticalIssue {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  category: 'CONSISTENCY' | 'MODEL_GATE' | 'FEATURE_ENGINEERING' | 'DATA_QUALITY' | 'STATISTICAL_BIAS';
  location: string;
  manifestation: string;
  rootCause: string;
  impact: string;
  solution: string;
}
