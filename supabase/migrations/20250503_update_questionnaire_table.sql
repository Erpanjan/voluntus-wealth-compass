
-- Add additional columns to questionnaire_responses table
ALTER TABLE public.questionnaire_responses 
ADD COLUMN IF NOT EXISTS age_group TEXT,
ADD COLUMN IF NOT EXISTS income_level TEXT,
ADD COLUMN IF NOT EXISTS net_worth TEXT,
ADD COLUMN IF NOT EXISTS investment_knowledge TEXT,
ADD COLUMN IF NOT EXISTS investment_experience TEXT,
ADD COLUMN IF NOT EXISTS complex_products NUMERIC,
ADD COLUMN IF NOT EXISTS investment_composition TEXT,
ADD COLUMN IF NOT EXISTS behavioral_biases TEXT,
ADD COLUMN IF NOT EXISTS answers_json JSONB;
