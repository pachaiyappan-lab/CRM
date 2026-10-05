import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import path from 'path';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini AI Client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ========================================================
// IN-MEMORY / EXTENSIBLE STORE FOR API RESPONSES
// ========================================================
let workspaceData = {
  id: 'ws-1',
  name: 'Your Company',
  currency: '$',
  currencyCode: 'USD',
  taxRate: 10,
  taxName: 'Sales Tax (10%)',
  ownerId: 'user-1',
  logo: '@',
};

let userProfileData = {
  id: 'user-1',
  name: 'Matthew Parker',
  email: 'matthew@yourcompany.com',
  role: 'admin',
  title: 'Founder & Store Owner',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  phone: '+1 (555) 234-5678',
};

// ========================================================
// REST API ENDPOINTS
// ========================================================

// 1. Health & Status
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!apiKey, timestamp: new Date().toISOString() });
});

// 2. Profile & Settings
app.get('/api/auth/profile', (req, res) => {
  res.json(userProfileData);
});

app.put('/api/auth/profile', (req, res) => {
  userProfileData = { ...userProfileData, ...req.body };
  res.json({ success: true, profile: userProfileData });
});

app.get('/api/workspace', (req, res) => {
  res.json(workspaceData);
});

app.put('/api/workspace', (req, res) => {
  workspaceData = { ...workspaceData, ...req.body };
  res.json({ success: true, workspace: workspaceData });
});

// 3. Dashboard Statistics Endpoint
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    totalSales: 9328.55,
    ordersCount: 725,
    salesGrowthPercent: 15.6,
    weeklySalesDelta: 1400,
    visitorsCount: 12302,
    avgTime: '4.2m',
    visitorGrowthPercent: 12.7,
    weeklyVisitorsDelta: 1200,
    refundsCount: 963,
    disputedCount: 3,
    refundsDeltaPercent: -12.7,
    chartData: {
      period: 'Last 14 Days',
      conversionRate: 10.6,
      topCategory: { name: 'Electronics', amount: 3410, share: 55 },
      total6MCash: 54820,
    },
  });
});

// 4. Gemini AI Route (Powered by Gemini 2.0 Flash)
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt, systemInstruction, model } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!aiClient) {
      return res.status(503).json({ error: 'GEMINI_API_KEY is not configured on server' });
    }

    const requestedModel = model || 'gemini-2.0-flash';
    let responseText = '';
    let activeModel = requestedModel;

    try {
      const response = await aiClient.models.generateContent({
        model: requestedModel,
        contents: prompt,
        config: systemInstruction ? { systemInstruction } : undefined,
      });
      responseText = response.text || '';
    } catch (modelErr: any) {
      console.warn(`Model ${requestedModel} invocation notice, attempting gemini-flash-latest:`, modelErr?.message);
      try {
        const fallbackRes = await aiClient.models.generateContent({
          model: 'gemini-flash-latest',
          contents: prompt,
          config: systemInstruction ? { systemInstruction } : undefined,
        });
        responseText = fallbackRes.text || '';
        activeModel = 'gemini-flash-latest';
      } catch (fbErr: any) {
        console.warn('Fallback to gemini-3.8-flash:', fbErr?.message);
        const finalRes = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: systemInstruction ? { systemInstruction } : undefined,
        });
        responseText = finalRes.text || '';
        activeModel = 'gemini-3.8-flash';
      }
    }

    return res.json({ text: responseText, model: activeModel });
  } catch (error: any) {
    console.error('Server Gemini API Error:', error);
    return res.status(500).json({ error: error.message || 'Error generating AI content' });
  }
});

// ========================================================
// STATIC SERVING & VITE DEV SERVER
// ========================================================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`NexusCRM server running at http://0.0.0.0:${port}`);
  });
}

startServer();
