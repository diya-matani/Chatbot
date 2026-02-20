# WizKlub High-Conversion AI Chatbot

A production-ready, high-conversion chatbot prototype for WizKlub.com built with Next.js, Tailwind CSS, and OpenAI API.

## 🎯 Features

- ✅ **State Machine Architecture** - Clean, maintainable conversation flow
- ✅ **Progress Bar** - Shows "Step X of 6" with visual progress
- ✅ **Lead Scoring** - Automatic scoring and temperature (HOT/WARM/COLD)
- ✅ **Success Screen** - Beautiful completion screen with lead temperature badge
- ✅ **Input Validation** - Email, phone, and field validation
- ✅ **Analytics Tracking** - Comprehensive event tracking
- ✅ **Smooth Animations** - Fade-in, slide-up, and typing indicators
- ✅ **Responsive Design** - Clean white + blue theme
- ✅ **Modular Components** - Well-organized, reusable code

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

### 4. Open Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # OpenAI API integration
│   ├── globals.css               # Global styles + animations
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── ChatbotWidget.tsx         # Main chatbot component
│   ├── MessageBubble.tsx         # Message display
│   ├── ChatInput.tsx             # Input with validation
│   ├── ProgressBar.tsx           # Progress indicator
│   └── SuccessScreen.tsx         # Completion screen
├── lib/
│   ├── stateMachine.ts           # State machine logic
│   ├── leadScorer.ts             # Lead scoring & temperature
│   ├── analytics.ts              # Analytics tracking
│   ├── leadStorage.ts            # Lead storage utilities
│   └── types.ts                   # TypeScript types
└── package.json
```

## 🧠 State Machine Flow

### Parent Flow (6 steps):
1. Welcome → User Type Selection
2. Full Name
3. Child Grade
4. Interest (Coding/Robotics/Math/Not Sure)
5. City
6. Email
7. Phone
8. Recommendation → Success

### School Flow (6 steps):
1. Welcome → User Type Selection
2. Full Name
3. Role
4. Student Strength
5. Curriculum
6. City
7. Email
8. Phone
9. Recommendation → Success

## 📊 Lead Scoring

### Parent Scoring:
- Grade 3–8 → +20 points
- Interested in Coding → +15 points
- Provided Phone → +20 points

### School Scoring:
- Role = Principal/Coordinator → +30 points
- Strength >1000 → +25 points
- Integrated curriculum → +20 points

### Lead Temperature:
- **HOT:** Score ≥ 60
- **WARM:** Score 30–59
- **COLD:** Score < 30

## 📈 Analytics Events

The chatbot tracks:
- `conversation_started`
- `user_type_selected`
- `lead_completed`
- `demo_clicked`
- `counselor_clicked`
- `brochure_downloaded`
- `partnership_call_clicked`
- `proposal_deck_clicked`

All events are logged to console and stored in localStorage.

## 💾 Lead Data Structure

```json
{
  "id": "timestamp",
  "name": "",
  "userType": "Parent" | "School",
  "grade_or_role": "",
  "interest_or_strength": "",
  "curriculum": "",
  "city": "",
  "email": "",
  "phone": "",
  "leadScore": 0,
  "leadTemperature": "HOT" | "WARM" | "COLD",
  "analytics": {
    "startedAt": "ISO string",
    "completedAt": "ISO string",
    "demoClicked": false
  }
}
```

## 🎨 UI Features

- **Clean Design:** White + blue theme with rounded corners
- **Message Bubbles:** Bot (left, gray) / User (right, blue)
- **Progress Bar:** Visual step indicator with percentage
- **Typing Indicator:** Animated dots while bot "types"
- **Success Screen:** Completion screen with temperature badge
- **Smooth Animations:** Fade-in, slide-up transitions
- **Quick Replies:** Button-based options for faster interaction
- **Validation:** Real-time error messages

## 🤖 AI Integration

The chatbot uses OpenAI GPT-4o-mini with:
- Context-aware system prompts
- Personalized responses based on user type
- Objection handling
- Conversion-focused messaging

## 🚀 Deployment & Hosting

### Build for Production

```bash
npm run build
```

### Option 1: Deploy to Vercel (Recommended)

**Via Vercel CLI:**
```bash
npm i -g vercel
vercel
```

**Via GitHub (Recommended):**
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variable: `OPENAI_API_KEY`
6. Click "Deploy"

Vercel will automatically:
- Build your Next.js app
- Deploy it to a production URL
- Set up automatic deployments on every push

### Option 2: Deploy to Netlify

**Via Netlify CLI:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

**Via GitHub:**
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Connect your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variable: `OPENAI_API_KEY`
7. Click "Deploy site"

### Option 3: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variable: `OPENAI_API_KEY`
5. Railway will auto-detect Next.js and deploy

### Option 4: Deploy to Render

1. Go to [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Settings:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variable: `OPENAI_API_KEY`
6. Click "Create Web Service"

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `NEXT_PUBLIC_APP_URL` - Your production URL (optional, for analytics)

### Post-Deployment Checklist

- ✅ Verify chatbot opens and works correctly
- ✅ Test both Parent and School flows
- ✅ Check that OpenAI API calls are working
- ✅ Verify analytics tracking
- ✅ Test on mobile devices
- ✅ Check console for any errors

## 🔧 Configuration

### Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `NEXT_PUBLIC_APP_URL` - Application URL (optional)

### Customization

- **Colors:** Edit `tailwind.config.js` to change theme colors
- **States:** Modify `lib/stateMachine.ts` to adjust conversation flow
- **Scoring:** Update `lib/leadScorer.ts` to change scoring logic
- **Analytics:** Extend `lib/analytics.ts` to integrate with your analytics service

## 📝 Notes

- Leads are stored in browser localStorage (for demo purposes)
- In production, integrate with your CRM/database
- Analytics events are logged to console and localStorage
- In production, send analytics to your analytics service (e.g., Google Analytics, Mixpanel)

## 🎯 Conversion Strategy

The chatbot is designed to:
1. **Engage** visitors immediately with friendly welcome
2. **Segment** into Parent or School flows
3. **Qualify** leads through progressive data collection
4. **Score** leads automatically
5. **Convert** with personalized recommendations and clear CTAs
6. **Complete** with success screen showing lead temperature

## 📄 License

MIT

---

Built with ❤️ for WizKlub
