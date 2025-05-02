
export interface ContactInquiry {
  id: string;
  first_name: string;
  last_name: string;
  contact_type: string;
  contact_info: string;
  message: string;
  created_at: string;
  status: string;
}

export interface ContactNote {
  id: string;
  contact_id: string;
  note: string;
  created_at: string;
  created_by: string;
}
