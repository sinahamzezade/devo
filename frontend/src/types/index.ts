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
  fields?: FormField[]; // For nested fields
  apiEndpoint?: string; // For dynamic options from API
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

export interface Submission {
  id: string;
  [key: string]: any;
}

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable?: boolean;
  filterable?: boolean;
}

export interface SubmissionsResponse {
  columns: string[];
  data: Submission[];
}
