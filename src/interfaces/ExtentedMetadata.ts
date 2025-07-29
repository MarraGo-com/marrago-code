import { Metadata } from "next";
import TwitterAppMetada from "./TwitterAppMetadata";
import AppleWebApp from "./AppleWebApp";

export default interface ExtendedMetadata extends Metadata {
    /*  facebook: {
       appId: string;
       admins: string;
     }; */
     twitter?: {
       card: 'summary_large_image' | 'app';
       title: string;
       description: string;
       siteId: string;
       creator: string;
       creatorId: string;
       images?: {
         url: string;
         alt?: string;
       }[];
       app?: TwitterAppMetada;
     };
     appleWebApp? : AppleWebApp;
     other?: Record<string, string>;
   }