/*
 * AI Directories — authoritative AI tool registry.
 * Generated from the curated dataset (80 tools). All counts, search, filters,
 * category pages and featured sections derive from this file.
 * Categories consolidated to 9 (every category has >= 6 real tools).
 */
(function (global) {
    'use strict';

    var CATEGORY_ICONS = {
        'AI Assistants': { name: 'AI Assistants', slug: 'ai-assistants', icon: 'fa-comments' },
        'AI Code': { name: 'AI Code', slug: 'ai-code', icon: 'fa-code' },
        'AI Image Gen': { name: 'AI Image Gen', slug: 'ai-image-gen', icon: 'fa-image' },
        'AI Video': { name: 'AI Video', slug: 'ai-video', icon: 'fa-video' },
        'AI Writing': { name: 'AI Writing', slug: 'ai-writing', icon: 'fa-pen-nib' },
        'AI Design': { name: 'AI Design', slug: 'ai-design', icon: 'fa-palette' },
        'AI Productivity': { name: 'AI Productivity', slug: 'ai-productivity', icon: 'fa-bolt' },
        'AI Marketing': { name: 'AI Marketing', slug: 'ai-marketing', icon: 'fa-bullhorn' },
        'AI Audio': { name: 'AI Audio', slug: 'ai-audio', icon: 'fa-headphones' }
    };

    var TOOLS = [
        { slug: 'chatgpt', name: 'ChatGPT', company: 'OpenAI', desc: 'AI chatbot with image generation, code interpretation, web browsing, and custom assistants.', category: 'AI Assistants', icon: 'fa-comment-dots', color: '#10a37f', pricing: 'freemium', badges: ['wellknown','top'], lastVerified: '2026-09-20', url: 'https://chat.openai.com' },
        { slug: 'claude', name: 'Claude', company: 'Anthropic', desc: 'Advanced AI assistant with a large context window, computer use, strong for long documents and coding.', category: 'AI Assistants', icon: 'fa-brain', color: '#d97706', pricing: 'freemium', badges: ['top'], lastVerified: '2026-09-20', url: 'https://claude.ai' },
        { slug: 'gemini', name: 'Gemini', company: 'Google', desc: 'Google\'s AI with long-context understanding, YouTube analysis, Deep Research, and full Google integration.', category: 'AI Assistants', icon: 'fa-star', color: '#4285f4', pricing: 'freemium', badges: ['wellknown'], lastVerified: '2026-09-20', url: 'https://gemini.google.com' },
        { slug: 'grok', name: 'Grok', company: 'xAI', desc: 'Real-time knowledge from X/Twitter. Uncensored responses, image generation, code assistance.', category: 'AI Assistants', icon: 'fa-bolt', color: '#1DA1F2', pricing: 'paid', badges: ['new'], lastVerified: '2026-09-20', url: 'https://grok.x.ai' },
        { slug: 'perplexity-ai', name: 'Perplexity AI', company: 'Perplexity', desc: 'AI-powered answer engine with real-time web search, citations, and source verification.', category: 'AI Assistants', icon: 'fa-magnifying-glass', color: '#20B2AA', pricing: 'freemium', badges: ['wellknown'], lastVerified: '2026-09-20', url: 'https://perplexity.ai' },
        { slug: 'microsoft-copilot', name: 'Microsoft Copilot', company: 'Microsoft', desc: 'AI integrated into Windows, Office, and Edge with image generation and web access.', category: 'AI Assistants', icon: 'fa-wand-magic-sparkles', color: '#7c3aed', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://copilot.microsoft.com' },
        { slug: 'jasper-ai', name: 'Jasper AI', company: 'Jasper', desc: 'Enterprise AI marketing platform. Brand voice, campaigns, blog posts, social media content.', category: 'AI Writing', icon: 'fa-pen-fancy', color: '#e11d48', pricing: 'paid', badges: [], lastVerified: '2026-09-20', url: 'https://jasper.ai' },
        { slug: 'copy-ai', name: 'Copy.ai', company: 'Copy.ai', desc: 'AI-powered marketing copy. Blog intros, product descriptions, email sequences, ad copy.', category: 'AI Writing', icon: 'fa-copy', color: '#8b5cf6', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://copy.ai' },
        { slug: 'writesonic', name: 'Writesonic', company: 'Writesonic', desc: 'AI writing for SEO content, blog posts, landing pages, and product descriptions at scale.', category: 'AI Writing', icon: 'fa-pen-nib', color: '#f59e0b', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://writesonic.com' },
        { slug: 'grammarly', name: 'Grammarly', company: 'Grammarly', desc: 'AI writing assistant for grammar, tone, clarity, and style. Real-time suggestions across all platforms.', category: 'AI Writing', icon: 'fa-spell-check', color: '#15c39a', pricing: 'freemium', badges: ['top'], lastVerified: '2026-09-20', url: 'https://grammarly.com' },
        { slug: 'quillbot', name: 'QuillBot', company: 'QuillBot', desc: 'AI paraphrasing, grammar check, summarizer, translator, and citation generator.', category: 'AI Writing', icon: 'fa-feather', color: '#1f77d0', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://quillbot.com' },
        { slug: 'notion-ai', name: 'Notion AI', company: 'Notion', desc: 'AI embedded in Notion workspace. Summarize, translate, brainstorm, and write within your docs.', category: 'AI Writing', icon: 'fa-n', color: '#ffffff', pricing: 'paid', badges: [], lastVerified: '2026-09-20', url: 'https://notion.so' },
        { slug: 'rytr', name: 'Rytr', company: 'Rytr', desc: 'AI writing assistant for blogs, emails, social posts, and landing pages, with guided templates.', category: 'AI Writing', icon: 'fa-t', color: '#6366f1', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://rytr.me' },
        { slug: 'midjourney', name: 'Midjourney', company: 'Midjourney', desc: 'AI art generator. Photorealistic images, artistic styles, and architectural renders.', category: 'AI Image Gen', icon: 'fa-image', color: '#000', pricing: 'paid', badges: ['top','wellknown'], lastVerified: '2026-09-20', url: 'https://midjourney.com' },
        { slug: 'dall-e-3', name: 'DALL·E 3', company: 'OpenAI', desc: 'OpenAI\'s image generator. Available in ChatGPT, follows complex prompts accurately, safe generation.', category: 'AI Image Gen', icon: 'fa-palette', color: '#10a37f', pricing: 'freemium', badges: ['wellknown'], lastVerified: '2026-09-20', url: 'https://openai.com/dall-e-3' },
        { slug: 'stable-diffusion', name: 'Stable Diffusion', company: 'Stability AI', desc: 'Open-source AI image generation. Local deployment, fine-tuning, ControlNet, massive community.', category: 'AI Image Gen', icon: 'fa-wand-sparkles', color: '#a855f7', pricing: 'free', badges: ['free','wellknown'], lastVerified: '2026-09-20', url: 'https://stability.ai' },
        { slug: 'adobe-firefly', name: 'Adobe Firefly', company: 'Adobe', desc: 'Commercially safe AI art. Integrated into Photoshop, Illustrator. Trained on licensed content only.', category: 'AI Image Gen', icon: 'fa-fire', color: '#ff0000', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://firefly.adobe.com' },
        { slug: 'leonardo-ai', name: 'Leonardo AI', company: 'Leonardo', desc: 'AI image generation for game assets, concept art, and design. Real-time canvas, fine-tuned models.', category: 'AI Image Gen', icon: 'fa-paintbrush', color: '#f97316', pricing: 'freemium', badges: ['new'], lastVerified: '2026-09-20', url: 'https://leonardo.ai' },
        { slug: 'ideogram', name: 'Ideogram', company: 'Ideogram', desc: 'AI image generation with accurate text rendering. Logos, typography, and posters.', category: 'AI Image Gen', icon: 'fa-i', color: '#6366f1', pricing: 'freemium', badges: ['new'], lastVerified: '2026-09-20', url: 'https://ideogram.ai' },
        { slug: 'flux', name: 'Flux', company: 'Black Forest Labs', desc: 'Ultra-fast open-source image model. Photorealistic, fast inference, available via API and local.', category: 'AI Image Gen', icon: 'fa-bolt-lightning', color: '#22c55e', pricing: 'free', badges: ['free','new'], lastVerified: '2026-09-20', url: 'https://blackforestlabs.ai' },
        { slug: 'playground-ai', name: 'Playground AI', company: 'Playground', desc: 'Free AI image generation with commercial license. Create and edit images with simple prompts.', category: 'AI Image Gen', icon: 'fa-sun', color: '#eab308', pricing: 'freemium', badges: ['free'], lastVerified: '2026-09-20', url: 'https://playground.com' },
        { slug: 'runway', name: 'Runway', company: 'Runway ML', desc: 'AI video generation platform with motion brush, text-to-video, and image-to-video.', category: 'AI Video', icon: 'fa-video', color: '#1e293b', pricing: 'paid', badges: ['top','wellknown'], lastVerified: '2026-09-20', url: 'https://runwayml.com' },
        { slug: 'sora', name: 'Sora', company: 'OpenAI', desc: 'OpenAI\'s text-to-video model for photorealistic scenes with consistent characters.', category: 'AI Video', icon: 'fa-film', color: '#10a37f', pricing: 'paid', badges: ['wellknown'], lastVerified: '2026-09-20', url: 'https://openai.com/sora' },
        { slug: 'pika', name: 'Pika', company: 'Pika Labs', desc: 'AI video generation made easy. Text-to-video, image-to-video, video editing with AI commands.', category: 'AI Video', icon: 'fa-clapperboard', color: '#ec4899', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://pika.art' },
        { slug: 'kling-ai', name: 'Kling AI', company: 'Kuaishou', desc: 'High-quality AI video generation with realistic motion, face consistency, and scene transitions.', category: 'AI Video', icon: 'fa-movie', color: '#0ea5e9', pricing: 'freemium', badges: ['new'], lastVerified: '2026-09-20', url: 'https://klingai.com' },
        { slug: 'synthesia', name: 'Synthesia', company: 'Synthesia', desc: 'AI avatar video creation in many languages, no camera needed. Ideal for corporate training.', category: 'AI Video', icon: 'fa-person', color: '#6366f1', pricing: 'paid', badges: [], lastVerified: '2026-09-20', url: 'https://synthesia.io' },
        { slug: 'heygen', name: 'HeyGen', company: 'HeyGen', desc: 'AI video generation with talking avatars. Voice cloning, lip sync, multi-language translation.', category: 'AI Video', icon: 'fa-id-card', color: '#f59e0b', pricing: 'paid', badges: ['new'], lastVerified: '2026-09-20', url: 'https://heygen.com' },
        { slug: 'luma-ai', name: 'Luma AI', company: 'Luma', desc: 'Dream Machine — fast AI video generation. 3D capture, realistic physics, camera motion control.', category: 'AI Video', icon: 'fa-video-slash', color: '#10b981', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://lumalabs.ai' },
        { slug: 'github-copilot', name: 'GitHub Copilot', company: 'GitHub/Microsoft', desc: 'AI pair programmer in your IDE. Code completion, chat, code review, multi-file editing.', category: 'AI Code', icon: 'fa-code', color: '#6e40c9', pricing: 'paid', badges: ['top','wellknown'], lastVerified: '2026-09-20', url: 'https://github.com/features/copilot' },
        { slug: 'cursor', name: 'Cursor', company: 'Cursor', desc: 'AI-first code editor. Multi-file edits, codebase context, agent mode, built on VS Code.', category: 'AI Code', icon: 'fa-terminal', color: '#7c3aed', pricing: 'freemium', badges: ['top'], lastVerified: '2026-09-20', url: 'https://cursor.com' },
        { slug: 'codeium-windsurf', name: 'Codeium / Windsurf', company: 'Codeium', desc: 'Free AI code completion and chat with tab autocomplete and multi-line suggestions.', category: 'AI Code', icon: 'fa-wind', color: '#06b6d4', pricing: 'freemium', badges: ['free'], lastVerified: '2026-09-20', url: 'https://codeium.com' },
        { slug: 'replit-ai', name: 'Replit AI', company: 'Replit', desc: 'AI coding in the browser. Build, deploy, and ship apps with AI assistant in a full IDE.', category: 'AI Code', icon: 'fa-play', color: '#f97316', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://replit.com' },
        { slug: 'v0-by-vercel', name: 'v0 by Vercel', company: 'Vercel', desc: 'AI generates production-ready React/Next.js UI. Tailwind CSS, shadcn/ui components.', category: 'AI Code', icon: 'fa-v', color: '#000', pricing: 'freemium', badges: ['top','new'], lastVerified: '2026-09-20', url: 'https://v0.dev' },
        { slug: 'bolt-new', name: 'Bolt.new', company: 'StackBlitz', desc: 'Prompt-to-app in browser. Full-stack web apps with AI — code, preview, deploy in seconds.', category: 'AI Code', icon: 'fa-bolt', color: '#1389fd', pricing: 'freemium', badges: ['new','wellknown'], lastVerified: '2026-09-20', url: 'https://bolt.new' },
        { slug: 'lovable', name: 'Lovable', company: 'Lovable', desc: 'AI full-stack app builder. Natural language to production app with Supabase, Stripe, auth built in.', category: 'AI Code', icon: 'fa-heart', color: '#ec4899', pricing: 'freemium', badges: ['new'], lastVerified: '2026-09-20', url: 'https://lovable.dev' },
        { slug: 'tabnine', name: 'Tabnine', company: 'Tabnine', desc: 'AI code completion that respects your codebase. Private, on-premise, and enterprise options.', category: 'AI Code', icon: 'fa-keyboard', color: '#e11d48', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://tabnine.com' },
        { slug: 'suno', name: 'Suno', company: 'Suno', desc: 'Create full songs with vocals, instruments, and lyrics from text prompts. Genre-agnostic.', category: 'AI Audio', icon: 'fa-music', color: '#f43f5e', pricing: 'freemium', badges: ['top','wellknown'], lastVerified: '2026-09-20', url: 'https://suno.com' },
        { slug: 'udio', name: 'Udio', company: 'Udio', desc: 'AI music generation with studio quality. Create any genre, realistic vocals, full arrangements.', category: 'AI Audio', icon: 'fa-headphones', color: '#8b5cf6', pricing: 'freemium', badges: ['new'], lastVerified: '2026-09-20', url: 'https://udio.com' },
        { slug: 'elevenlabs', name: 'ElevenLabs', company: 'ElevenLabs', desc: 'Most realistic AI voice synthesis. Voice cloning, text-to-speech, voice changer, dubbing.', category: 'AI Audio', icon: 'fa-microphone', color: '#000', pricing: 'freemium', badges: ['top','wellknown'], lastVerified: '2026-09-20', url: 'https://elevenlabs.io' },
        { slug: 'descript', name: 'Descript', company: 'Descript', desc: 'AI-powered audio/video editing. Transcription, filler word removal, voice cloning, screen recording.', category: 'AI Audio', icon: 'fa-podcast', color: '#4f46e5', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://descript.com' },
        { slug: 'aiva', name: 'AIVA', company: 'AIVA', desc: 'AI composer for film, games, and ads. Emotion-based music, custom styles, royalty-free.', category: 'AI Audio', icon: 'fa-guitar', color: '#0ea5e9', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://aiva.ai' },
        { slug: 'murf-ai', name: 'Murf AI', company: 'Murf', desc: 'AI voiceover platform with studio-quality narration in many voices and languages.', category: 'AI Audio', icon: 'fa-volume-high', color: '#7c3aed', pricing: 'paid', badges: [], lastVerified: '2026-09-20', url: 'https://murf.ai' },
        { slug: 'figma-ai', name: 'Figma AI', company: 'Figma', desc: 'AI features in Figma: auto-layout suggestions, design to code, rename layers, find similar components.', category: 'AI Design', icon: 'fa-diamond', color: '#a259ff', pricing: 'freemium', badges: ['wellknown'], lastVerified: '2026-09-20', url: 'https://figma.com' },
        { slug: 'canva-ai', name: 'Canva AI', company: 'Canva', desc: 'Magic Design, text-to-image, background remover, magic eraser, AI presentations, brand kit.', category: 'AI Design', icon: 'fa-s', color: '#00c4cc', pricing: 'freemium', badges: ['wellknown','top'], lastVerified: '2026-09-20', url: 'https://canva.com' },
        { slug: 'looka', name: 'Looka', company: 'Looka', desc: 'AI logo maker and brand identity. Generate logos, business cards, social media kits in minutes.', category: 'AI Design', icon: 'fa-palette', color: '#6366f1', pricing: 'paid', badges: [], lastVerified: '2026-09-20', url: 'https://looka.com' },
        { slug: 'galileo-ai', name: 'Galileo AI', company: 'Galileo', desc: 'AI UI design — text to high-fidelity mockups. Generate complete UI designs from descriptions.', category: 'AI Design', icon: 'fa-wand-magic', color: '#22c55e', pricing: 'freemium', badges: ['new'], lastVerified: '2026-09-20', url: 'https://usegalileo.ai' },
        { slug: 'uizard', name: 'Uizard', company: 'Uizard', desc: 'AI design tool for non-designers. Text-to-design, screenshot-to-design, hand-drawn to mockup.', category: 'AI Design', icon: 'fa-object-group', color: '#3b82f6', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://uizard.io' },
        { slug: 'designify', name: 'Designify', company: 'Designify', desc: 'AI-powered design automation. Remove backgrounds, create mockups, generate product photos.', category: 'AI Design', icon: 'fa-wand-sparkles', color: '#f97316', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://designify.com' },
        { slug: 'otter-ai', name: 'Otter.ai', company: 'Otter', desc: 'AI meeting notes and transcription. Real-time transcription, summaries, action items, zoom integration.', category: 'AI Productivity', icon: 'fa-otter', color: '#3b82f6', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://otter.ai' },
        { slug: 'taskade', name: 'Taskade', company: 'Taskade', desc: 'AI-powered productivity. Mind maps, outlines, notes, and tasks with AI agents and automation.', category: 'AI Productivity', icon: 'fa-list-check', color: '#22c55e', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://taskade.com' },
        { slug: 'reclaim-ai', name: 'Reclaim.ai', company: 'Reclaim', desc: 'AI scheduling assistant. Auto-schedule habits, tasks, meetings. Smart time blocking.', category: 'AI Productivity', icon: 'fa-calendar', color: '#8b5cf6', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://reclaim.ai' },
        { slug: 'mem', name: 'Mem', company: 'Mem', desc: 'AI note-taking that connects your knowledge. Auto-organize, search, and surface relevant notes.', category: 'AI Productivity', icon: 'fa-book', color: '#6366f1', pricing: 'freemium', badges: ['new'], lastVerified: '2026-09-20', url: 'https://mem.ai' },
        { slug: 'surfer-seo', name: 'Surfer SEO', company: 'Surfer', desc: 'AI content optimization for SEO. Content editor, keyword research, SERP analyzer, audit tool.', category: 'AI Marketing', icon: 'fa-chart-line', color: '#10b981', pricing: 'paid', badges: ['top'], lastVerified: '2026-09-20', url: 'https://surferseo.com' },
        { slug: 'hubspot-ai', name: 'HubSpot AI', company: 'HubSpot', desc: 'AI-powered CRM, marketing, sales, and service. Content assistant, chatbot, email generation.', category: 'AI Marketing', icon: 'fa-sprocket', color: '#ff7a59', pricing: 'freemium', badges: ['wellknown'], lastVerified: '2026-09-20', url: 'https://hubspot.com' },
        { slug: 'anyword', name: 'Anyword', company: 'Anyword', desc: 'AI copywriting with predictive performance scores. Know which copy converts before publishing.', category: 'AI Marketing', icon: 'fa-bullseye', color: '#6366f1', pricing: 'paid', badges: [], lastVerified: '2026-09-20', url: 'https://anyword.com' },
        { slug: 'phrasee', name: 'Phrasee', company: 'Phrasee', desc: 'AI for enterprise email marketing. Subject lines, push notifications, SMS with brand-optimized AI.', category: 'AI Marketing', icon: 'fa-a', color: '#1e40af', pricing: 'paid', badges: [], lastVerified: '2026-09-20', url: 'https://phrasee.co' },
        { slug: 'algolia', name: 'Algolia', company: 'Algolia', desc: 'AI-powered search and discovery API. Typo tolerance, synonyms, personalization, analytics.', category: 'AI Code', icon: 'fa-magnifying-glass-chart', color: '#003dff', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://algolia.com' },
        { slug: 'hugging-face', name: 'Hugging Face', company: 'Hugging Face', desc: 'Open-source AI hub with models, datasets, Spaces, and Inference API. The GitHub of ML.', category: 'AI Code', icon: 'fa-face-smile', color: '#ffd21e', pricing: 'freemium', badges: ['top','wellknown','free'], lastVerified: '2026-09-20', url: 'https://huggingface.co' },
        { slug: 'replicate', name: 'Replicate', company: 'Replicate', desc: 'Run ML models via a simple API. Pay-per-use, no infrastructure setup required.', category: 'AI Code', icon: 'fa-server', color: '#3b82f6', pricing: 'paid', badges: [], lastVerified: '2026-09-20', url: 'https://replicate.com' },
        { slug: 'vercel-ai-sdk', name: 'Vercel AI SDK', company: 'Vercel', desc: 'Build AI apps with TypeScript. Streaming UI, edge functions, model providers, chatbot templates.', category: 'AI Code', icon: 'fa-triangle-exclamation', color: '#000', pricing: 'free', badges: ['free','new'], lastVerified: '2026-09-20', url: 'https://sdk.vercel.ai' },
        { slug: 'langchain', name: 'LangChain', company: 'LangChain', desc: 'Framework for building LLM apps. Chains, agents, RAG, memory, and tool integrations.', category: 'AI Code', icon: 'fa-link', color: '#1e3a5f', pricing: 'free', badges: ['free','wellknown'], lastVerified: '2026-09-20', url: 'https://langchain.com' },
        { slug: 'julius-ai', name: ' Julius AI', company: 'Julius', desc: 'AI data analyst. Upload files, ask questions in natural language, get charts and insights instantly.', category: 'AI Productivity', icon: 'fa-chart-bar', color: '#6366f1', pricing: 'freemium', badges: ['new'], lastVerified: '2026-09-20', url: 'https://julius.ai' },
        { slug: 'obviously-ai', name: 'Obviously AI', company: 'Obviously AI', desc: 'No-code predictive analytics. Upload data, get predictions in minutes without ML expertise.', category: 'AI Productivity', icon: 'fa-microscope', color: '#10b981', pricing: 'paid', badges: [], lastVerified: '2026-09-20', url: 'https://obviously.ai' },
        { slug: 'hex', name: 'Hex', company: 'Hex', desc: 'AI-powered data workspace. SQL, Python, notebooks, and AI together for data teams.', category: 'AI Productivity', icon: 'fa-hexagon-check', color: '#8b5cf6', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://hex.tech' },
        { slug: 'clay', name: 'Clay', company: 'Clay', desc: 'AI sales prospecting with data enrichment, AI personalization, and automated outreach.', category: 'AI Marketing', icon: 'fa-people-group', color: '#f59e0b', pricing: 'paid', badges: ['top','new'], lastVerified: '2026-09-20', url: 'https://clay.com' },
        { slug: 'apollo-io', name: 'Apollo.io', company: 'Apollo', desc: 'AI-powered sales intelligence with contact databases, email sequences, dialer, and a Chrome extension.', category: 'AI Marketing', icon: 'fa-rocket', color: '#6366f1', pricing: 'freemium', badges: ['wellknown'], lastVerified: '2026-09-20', url: 'https://apollo.io' },
        { slug: 'gong', name: 'Gong', company: 'Gong', desc: 'AI revenue intelligence. Conversation analysis, deal intelligence, coaching, forecasting.', category: 'AI Marketing', icon: 'fa-phone-volume', color: '#e11d48', pricing: 'paid', badges: [], lastVerified: '2026-09-20', url: 'https://gong.io' },
        { slug: 'intercom-fin', name: 'Intercom Fin', company: 'Intercom', desc: 'AI customer service agent that resolves support tickets and learns from your help center.', category: 'AI Productivity', icon: 'fa-headset', color: '#286efa', pricing: 'paid', badges: ['top'], lastVerified: '2026-09-20', url: 'https://intercom.com' },
        { slug: 'zendesk-ai', name: 'Zendesk AI', company: 'Zendesk', desc: 'AI-powered customer service. Automated responses, agent assistance, sentiment analysis.', category: 'AI Productivity', icon: 'fa-comments', color: '#03363d', pricing: 'paid', badges: ['wellknown'], lastVerified: '2026-09-20', url: 'https://zendesk.com' },
        { slug: 'tidio', name: 'Tidio', company: 'Tidio', desc: 'AI chatbot and live chat. Lyro AI assistant, chatbots, email integration, visitor tracking.', category: 'AI Productivity', icon: 'fa-robot', color: '#22c55e', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://tidio.com' },
        { slug: 'spline', name: 'Spline', company: 'Spline', desc: '3D design tool for the web. Create interactive 3D experiences, embed in websites, no code.', category: 'AI Design', icon: 'fa-cube', color: '#5b6abf', pricing: 'freemium', badges: ['wellknown'], lastVerified: '2026-09-20', url: 'https://spline.design' },
        { slug: 'meshy', name: 'Meshy', company: 'Meshy', desc: 'AI 3D model generation. Text-to-3D, image-to-3D, AI textures, export to any 3D format.', category: 'AI Design', icon: 'fa-cubes', color: '#22c55e', pricing: 'freemium', badges: ['new'], lastVerified: '2026-09-20', url: 'https://meshy.ai' },
        { slug: 'tripo-ai', name: 'Tripo AI', company: 'Tripo', desc: 'AI 3D generation from text or images. High-quality mesh, PBR textures, instant generation.', category: 'AI Design', icon: 'fa-dice-d20', color: '#6366f1', pricing: 'freemium', badges: ['new'], lastVerified: '2026-09-20', url: 'https://tripo3d.ai' },
        { slug: 'gamma', name: 'Gamma', company: 'Gamma', desc: 'AI-powered presentations, documents, and websites. No slides — beautiful, web-native format.', category: 'AI Design', icon: 'fa-presentation-screen', color: '#8b5cf6', pricing: 'freemium', badges: ['top','wellknown'], lastVerified: '2026-09-20', url: 'https://gamma.app' },
        { slug: 'beautiful-ai', name: 'Beautiful.ai', company: 'Beautiful.ai', desc: 'AI presentation maker. Smart templates, auto-formatting, designer bot, team collaboration.', category: 'AI Design', icon: 'fa-desktop', color: '#4f46e5', pricing: 'paid', badges: [], lastVerified: '2026-09-20', url: 'https://beautiful.ai' },
        { slug: 'tome', name: 'Tome', company: 'Tome', desc: 'AI storytelling platform. Generate presentations, one-pagers, and documents from prompts.', category: 'AI Design', icon: 'fa-book-open', color: '#000', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://tome.app' },
        { slug: 'teal', name: 'Teal', company: 'Teal', desc: 'AI resume builder and job tracker. ATS-optimized templates, keyword matching, application tracking.', category: 'AI Productivity', icon: 'fa-file-lines', color: '#22c55e', pricing: 'freemium', badges: ['wellknown'], lastVerified: '2026-09-20', url: 'https://tealhq.com' },
        { slug: 'kickresume', name: 'Kickresume', company: 'Kickresume', desc: 'AI resume and cover letter writer. LinkedIn optimizer, resume checker, career blog.', category: 'AI Productivity', icon: 'fa-user-check', color: '#6366f1', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://kickresume.com' },
        { slug: 'botpress', name: 'Botpress', company: 'Botpress', desc: 'Open-source chatbot platform. Visual builder, LLM integration, multi-channel deployment.', category: 'AI Assistants', icon: 'fa-robot', color: '#0066ff', pricing: 'freemium', badges: ['top'], lastVerified: '2026-09-20', url: 'https://botpress.com' },
        { slug: 'voiceflow', name: 'Voiceflow', company: 'Voiceflow', desc: 'AI agent builder. Design, build, and deploy conversational AI with visual flow builder.', category: 'AI Assistants', icon: 'fa-waveform', color: '#3b82f6', pricing: 'freemium', badges: [], lastVerified: '2026-09-20', url: 'https://voiceflow.com' }
    ];

    var FEATURED = ['chatgpt', 'claude', 'grammarly', 'midjourney', 'runway', 'github-copilot', 'cursor', 'v0-by-vercel'];

    function bySlug(slug) {
        for (var i = 0; i < TOOLS.length; i++) if (TOOLS[i].slug === slug) return TOOLS[i];
        return null;
    }
    function categorySlug(name) {
        return name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    function byCategory(catName) {
        return TOOLS.filter(function (t) { return t.category === catName; });
    }
    function categoryList() {
        var counts = {};
        TOOLS.forEach(function (t) { counts[t.category] = (counts[t.category] || 0) + 1; });
        return Object.keys(counts).map(function (name) {
            return { name: name, slug: categorySlug(name), count: counts[name], icon: CATEGORY_ICONS[name] ? CATEGORY_ICONS[name].icon : 'fa-robot' };
        }).sort(function (a, b) { return b.count - a.count; });
    }
    function search(q) {
        if (!q) return TOOLS.slice();
        q = q.toLowerCase();
        return TOOLS.filter(function (t) {
            return t.name.toLowerCase().indexOf(q) !== -1 ||
                   t.desc.toLowerCase().indexOf(q) !== -1 ||
                   t.category.toLowerCase().indexOf(q) !== -1 ||
                   t.company.toLowerCase().indexOf(q) !== -1;
        });
    }
    function featuredTools() {
        return FEATURED.map(bySlug).filter(Boolean);
    }

    // --- localStorage: AI tool favorites / recently viewed (namespaced, safe) ---
    function lsGet(key) {
        try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; }
    }
    function lsSet(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
    }
    function recordView(slug) {
        var rec = lsGet('aid_recent_ai').filter(function (s) { return s !== slug; });
        rec.unshift(slug);
        lsSet('aid_recent_ai', rec.slice(0, 8));
    }
    function getRecent() { return lsGet('aid_recent_ai').map(bySlug).filter(Boolean); }
    function toggleFavorite(slug) {
        var favs = lsGet('aid_fav_ai');
        var i = favs.indexOf(slug);
        if (i === -1) favs.unshift(slug); else favs.splice(i, 1);
        lsSet('aid_fav_ai', favs);
        return i === -1;
    }
    function isFavorite(slug) { return lsGet('aid_fav_ai').indexOf(slug) !== -1; }
    function getFavorites() { return lsGet('aid_fav_ai').map(bySlug).filter(Boolean); }

    // --- Delegated favorite-star handler for .ai-card-fav buttons (directory, homepage, detail) ---
    function syncFavButtons(root) {
        (root || document).querySelectorAll('.ai-card-fav[data-fav]').forEach(function (btn) {
            var on = isFavorite(btn.getAttribute('data-fav'));
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }
    document.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('.ai-card-fav[data-fav]') : null;
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        var slug = btn.getAttribute('data-fav');
        var on = toggleFavorite(slug);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        var label = btn.getAttribute('aria-label') || '';
        btn.setAttribute('aria-label', on ? label.replace('Save', 'Remove') : label.replace('Remove', 'Save'));
        try { document.dispatchEvent(new CustomEvent('aid:favs-changed', { detail: { slug: slug, on: on } })); } catch (err) {}
    }, true);
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { syncFavButtons(); });
    else syncFavButtons();

    global.AIRegistry = {
        tools: TOOLS,
        featured: FEATURED,
        categoryIcons: CATEGORY_ICONS,
        bySlug: bySlug,
        byCategory: byCategory,
        categorySlug: categorySlug,
        categoryList: categoryList,
        search: search,
        featuredTools: featuredTools,
        recordView: recordView,
        getRecent: getRecent,
        toggleFavorite: toggleFavorite,
        isFavorite: isFavorite,
        getFavorites: getFavorites,
        syncFavButtons: syncFavButtons
    };
})(window);
