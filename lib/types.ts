// Type definitions for collections of azkar (Zikr)
export type Zikr = {
  title: string;
  content: string;
  notes?: string;
  footer?: string;
  url?: string;
}

export type ZikrCollection = {
  title: string;
  collection: Zikr[];
}
