export interface FormField {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    min?: number;
    max?: number;
  };
  conditions?: {
    field: string;
    operator: "equals" | "notEquals" | "contains" | "greaterThan" | "lessThan";
    value: string | number | boolean;
  }[];
  fields?: FormField[];
  apiEndpoint?: string;
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormField[];
}

export interface FormStructure {
  id: string;
  title: string;
  type: string;
  sections?: FormSection[];
  fields?: FormField[];
}

export interface SubmissionData {
  [key: string]: any;
}

export interface Submission {
  id: string;
  data: SubmissionData;
  createdAt: Date;
  status: string;
  type?: string;
}

export interface ColumnDefinition {
  id: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
} 