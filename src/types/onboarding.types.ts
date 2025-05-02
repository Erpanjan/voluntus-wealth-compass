
export interface ApplicationData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  status: string;
  consultation_date: string;
  consultation_time: string;
  consultation_type: string;
}

export interface QuestionnaireResponse {
  id: string;
  user_id: string;
  investment_goals: string | null;
  risk_tolerance: string | null;
  time_horizon: string | null;
  additional_info: string | null;
  age_group: string | null;
  income_level: string | null;
  net_worth: string | null;
  investment_knowledge: string | null;
  investment_experience: string | null;
  complex_products: number | null;
  investment_composition: string | null;
  behavioral_biases: string | null;
  created_at: string;
  updated_at: string;
}
