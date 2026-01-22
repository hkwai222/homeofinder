
// This file is no longer used as logic has been moved to frontend geminiService.ts 
// to comply with direct SDK usage guidelines and process.env.API_KEY injection.
export default async function handler(req: any, res: any) {
  return res.status(410).json({ error: 'Endpoint Deprecated' });
}
