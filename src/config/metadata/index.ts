// src/config/metadata/index.ts
export const FORMAT_DETECTION = {
    email: true,
    address: true,
    telephone: true,
  };
export const ICONS= {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
    other: {
      rel: 'icon',
      url: '/favicon.ico',
    },
  };   
  export const ARCHIVES = [process.env.NEXT_PUBLIC_API_URL, `/policy`] as string[];

  export const ASSETS = [`/assets`];
  
  export const BOOKMARKS = [`/bookmarks`];
  
  export const CATEGORY = "tourism";
  
  export const FACEBOOK = {
    appId: '12345678',
    admins: '12345678',
  };
  
  export const OTHER = {
  meta1: 'value1',
  meta2: 'value2',
  };
  
  export const REFERRER = ""; 

  export const ITUNES = {
    appId: 'myAppStoreID',
    appArgument: 'myAppArgument',
  };