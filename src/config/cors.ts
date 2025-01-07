import { CorsOptions } from 'cors';

const allowedOrigins = [
  'http://localhost:3000',      // Dev
  'https://glorialan.com'       // Production
];

const corsConfig: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // !origin is for requests from the same origin
      // The browser doesn't set the "Origin" header unless the API call's domain is
      // different from the one where the page is being served.
      console.log("[CORS] Access from", origin);
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

export default corsConfig;