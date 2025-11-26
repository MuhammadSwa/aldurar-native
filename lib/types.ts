// Type definitions for collections of azkar (Zikr)
export type Zikr = {
  title?: string;
  notes?: string;
  url?: string;
  footer?: string;
  content?: string;
}

export type ZikrCollection = {
  title?: string;
  collection?: Zikr[];
}
