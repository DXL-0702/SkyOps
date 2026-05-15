export type EvaluationFailedCaseLocaleCopy = {
  case_name?: string;
  category?: string;
  failure_reasons?: string[];
};

export type EvaluationFailedCase = {
  case_id?: string;
  case_name?: string;
  category?: string;
  failure_reasons?: string[];
  localized?: {
    zh?: EvaluationFailedCaseLocaleCopy;
    en?: EvaluationFailedCaseLocaleCopy;
  };
};

export type EvaluationReportSummary = {
  report_type?: string;
  data_origin?: string;
  uses_real_api?: boolean;
  note?: string;
  case_count: number;
  passed_count: number;
  failed_count: number;
  hard_constraint_pass_rate: number;
  risk_recall_avg: number;
  incident_response_avg: number;
  explainability_avg: number;
  failed_cases?: EvaluationFailedCase[];
};
