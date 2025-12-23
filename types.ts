
export interface AttractionImage {
  src: string;
  subject: string;
  ext: string;
}

export interface AttractionCategory {
  id: number;
  name: string;
}

export interface Attraction {
  id: number;
  name: string;
  name_zh: string | null;
  open_status: number;
  introduction: string;
  open_time: string;
  zipcode: string;
  distric: string;
  address: string;
  tel: string;
  fax: string;
  email: string;
  months: string;
  nlat: number;
  elong: number;
  official_site: string;
  facebook: string;
  ticket: string;
  remind: string;
  staytime: string;
  modified: string;
  url: string;
  category: AttractionCategory[];
  target: AttractionCategory[];
  service: AttractionCategory[];
  friendly: AttractionCategory[];
  images: AttractionImage[];
  files: any[];
  links: any[];
}

export interface TaipeiAPIResponse {
  total: number;
  data: Attraction[];
}

export interface AIChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  groundingUrls?: { title: string; uri: string }[];
}
