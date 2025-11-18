# Centro de Día Comunitario - 25 de Mayo

Web application with AI-powered chatbot for the Community Day Center of 25 de Mayo, La Pampa, Argentina.

## Features

- **Landing Page** - Comprehensive information about the center, services, and workshops
- **AI Chatbot** - Floating chat widget with intelligent responses powered by Groq (Llama 3.1)
- **RAG System** - Retrieval Augmented Generation for accurate information delivery
- **Responsive Design** - Mobile-first approach with modern UI/UX
- **Real-time Chat** - Instant responses with typing indicators

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **AI:** Groq SDK + LangChain
- **Deployment:** Vercel

## Prerequisites

- Node.js 20.x or higher
- Groq API Key (free at [console.groq.com](https://console.groq.com))

## Installation

```bash
# Clone the repository
git clone https://github.com/PabloPoletti/PruebaCDC-Vercel.git
cd PruebaCDC-Vercel

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local and add your GROQ_API_KEY

# Run development server
npm run dev

# Open http://localhost:3000
```

## Environment Variables

Create a `.env.local` file with:

```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your free API key at [console.groq.com](https://console.groq.com)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add `GROQ_API_KEY` in Environment Variables
4. Deploy

The app will be available at `https://your-project.vercel.app`

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/chat/       # Chat API endpoint
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── LandingPage.tsx      # Main landing page
│   │   ├── FloatingChatBot.tsx  # Floating chat widget
│   │   ├── ChatHeader.tsx       # Chat header component
│   │   ├── ChatMessage.tsx      # Message bubble component
│   │   ├── ChatInput.tsx        # Input component
│   │   └── TypingIndicator.tsx  # Typing animation
│   └── lib/
│       └── botLogic.ts     # Bot logic + RAG implementation
├── data/                    # Knowledge base files
│   ├── info_cdc.txt
│   ├── talleres.txt
│   └── preguntas_frecuentes.txt
├── public/                  # Static assets
└── package.json
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Features Detail

### Landing Page
- Hero section with center information
- Interactive workshop cards
- Services and activities overview
- Contact information and schedule
- Responsive design for all devices

### AI Chatbot
- Floating button with unread message counter
- Expandable chat widget
- Natural language understanding
- RAG-based responses from knowledge base
- Menu-driven navigation
- Appointment booking system

### RAG System
- Keyword-based search in knowledge base
- Context-aware responses using Groq AI
- ~15,000 words of CDC information
- Fast response times (<500ms)

## License

© 2025 Centro de Día Comunitario - 25 de Mayo. All rights reserved.

## Contact

**Centro de Día Comunitario – 25 de Mayo**

- Address: Trenel 53, Colonia 25 de Mayo, La Pampa, Argentina
- Phone: 299 4152668
- Email: cdc.25demayolp.coordinacion@gmail.com
- Website: [sites.google.com/view/centro-de-dia-25-de-mayo](https://sites.google.com/view/centro-de-dia-25-de-mayo/)

## Related Projects

- [WhatsApp Bot](https://github.com/PabloPoletti/PruebaCDC) - WhatsApp integration
- [Streamlit App](https://github.com/PabloPoletti/PruebaCDC-Streamlit) - Simple web interface

---

Made with 💚 for the Community Day Center of 25 de Mayo
