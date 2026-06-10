import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import ArticlesClient from "@/components/ArticlesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles — Jeff Mariano",
  description:
    "Thoughts on AI design, human-centered technology, and the future of intelligent systems.",
};

const articles = [
  {
    title: "We ran a focus group expecting skeptics. We found people who had already moved on without us.",
    date: "May 28, 2026",
    tag: "AI + UX",
    topic: "AI + UX",
    summary:
      "A field note on the moment AI adoption stopped looking like a product rollout and started looking like a social change already underway.",
    image: "/images/articles/PXL_20260414_192950980.MP.jpg",
    href: "#focus-group-ai-adoption",
    featured: true,
    content: [
      "We'd bring an AI feature into a retail environment and watch people fold their arms. Not hostile — just unconvinced. Why would I use this? I already know how to do my job.",
      "That resistance wasn't irrational. These were experienced people. They'd been burned before by tools that promised to help and mostly created more steps.",
      "So we built carefully. We listened. We adjusted.",
      "This week, we ran a focus group. I walked in expecting to measure how far the skepticism had moved.",
      "I wasn't prepared for what I found.",
      'One rep said: "When I don\'t know something, I go in the back, ask AI, and come back with the answer."',
      "Another one didn't say anything. He just opened his laptop and showed us — a repeated task he'd quietly automated on his own.",
      "Nobody assigned this. Nobody trained them on it. They found the gaps in their own workflow and filled them with tools they pulled in themselves. They were already there.",
      "But the adoption curve is not the interesting part.",
      "The interesting part is what they said next.",
      "They didn't want AI to tell them what to do. They were clear about that. What they wanted was something that would amplify what they already do well. They're the ones reading body language. They're the ones catching what a customer isn't saying. They're the ones translating tone, hesitation, context — in real time, in a way no model can replicate.",
      "What they wanted from AI was support when they needed it. Not a driver. A partner they could reach for.",
      "I've heard this before.",
      "My wife is a physician. When I show her what I'm building for health behavior change, she says the same thing in different words: The patient has to feel like it's theirs. The moment it feels like the tool is running them, they leave.",
      "Two completely different domains. Two completely different populations. The same conclusion, arrived at independently:",
      "Amplify me. Don't replace me.",
      "What I didn't expect was how fast the perception shifted. Months — not years. People who said no, who said maybe, who said I don't see the point — this week they were showing me what they'd already figured out on their own.",
      "That's not a product win. That's a social change. And I watched it happen in real time.",
      "The most useful thing a focus group ever told me wasn't in their answers. It was in what they were already doing before I asked a single question.",
    ],
  },
  {
    title: "The Human-Centered Future of AI in Retail",
    date: "Aug 10, 2025",
    tag: "AI Design",
    topic: "Retail",
    summary:
      "Why retail AI succeeds when it supports human judgment instead of trying to replace the conversation between employees and customers.",
    image: "/images/2.Article.png",
    href: "https://jmariano19.substack.com/p/the-human-centered-future-of-ai-in?r=gv4h7&utm_campaign=post&utm_medium=web&triedRedirect=true",
  },
  {
    title: "I’m starting to see a pattern in AI-generated work. It looks complete. And it falls apart the moment you ask “why?”",
    date: "Apr 22, 2026",
    tag: "AI + UX",
    topic: "AI + UX",
    summary:
      "A short essay on polished AI output, weak reasoning, and why prompts need a point of view before they need a model.",
    image: "/images/3.Article.png",
    href: "#ai-generated-work-why",
    content: [
      "A person showed me their work this week. Clean layout. Standard sections. Nothing wrong with it technically.",
      "But it was obvious immediately — it came from a prompt like: “give me the best...”",
      "There was no thinking behind it. Just output.",
      "A week later, someone shared a presentation on next steps for a project. Slide after slide of well-formatted bullet points. Comprehensive.",
      "And completely disconnected from anything specific about the actual problem.",
      "Same pattern. Thoughtless prompt. Polished result.",
      "I want to be clear about what I’m not saying: I’m not saying don’t use AI. I use it every day.",
      "What I’m saying is this:",
      "AI doesn’t replace thinking. It exposes whether you did any.",
      "Before AI, weak thinking was visible early. It showed up in rough work, in gaps, in things that didn’t quite make sense.",
      "Now it hides behind polished output.",
      "The work looks complete. Until someone asks: why?",
      "And that’s where it breaks.",
      "The person who made it can’t defend it. Can’t explain the reasoning. Can’t evolve it when someone pushes back.",
      "In a collaborative setting — a design review, a strategy session, a handoff — that doesn’t save time.",
      "It creates confusion.",
      "Everyone has to work backward to figure out if there’s anything real to build on.",
      "AI is an amplifier.",
      "Bring it strong thinking — a specific question, a real constraint, something you’ve already wrestled with — and it makes it stronger.",
      "Bring it lazy thinking — “give me the best,” “design this for me,” “summarize the next steps” —",
      "and it amplifies the laziness.",
      "The output looks fine. That’s the problem.",
      "Bring your thinking first. Use AI to expand what’s already strong, not to generate what you haven’t figured out yet.",
      "Don’t bring a prompt. Bring a point of view.",
    ],
  },
  {
    title: "The Invisible Interface: Conversational AI and the End of Screens",
    date: "Jun 2025",
    tag: "Product Design",
    topic: "Systems",
    summary:
      "How conversational AI changes the role of screens, and why designers still need structure, pacing, and feedback loops.",
    image: "/images/4.Article.png",
    href: "#",
  },
  {
    title: "Most patients disengage after bad blood work. This one didn’t.",
    date: "Apr 29, 2026",
    tag: "AI + Health",
    topic: "Health",
    summary:
      "A field note on health behavior change, timing, and why the month before the crisis is often the real product.",
    image: "/images/5.Article.png",
    href: "#plato-inteligente-blood-work",
    content: [
      "He got his blood work back. His LDL was elevated. He became more engaged, not less.",
      "He sent me his results.",
      "His LDL was elevated — the kind of number where the conversation shifts. Where food stops being a preference and starts being medicine.",
      "A year ago, that moment would have gone the way it usually does. Doctor delivers the news. Patient leaves feeling scared, maybe guilty. The next week looks like the week before because nothing about the advice made change feel possible.",
      "But he'd been using Plato Inteligente for few months. And that changed how the moment landed.",
      "The system already knew him. Not his demographics — him. His patterns. The foods he reaches for when he’s tired. The meals he logs and the ones he doesn’t. The small adjustments he’s already tried to make.",
      "So when the blood work came in, we weren’t starting from zero. We were looking at new information inside a context that already existed.",
      "The reframe — food as medicine — didn’t land as an accusation. It landed as the next logical step in a process he was already in.",
      "Most health interventions lead with the problem. A number. A warning. A list of things to stop doing. The intention is to motivate. What it often creates is shame — and shame makes people disappear.",
      "What I’ve been learning is this:",
      "The foundation you build before the crisis determines what the crisis becomes.",
      "The incremental adjustments. No blame. Meeting someone where they actually are, not where you think they should be. None of that looks dramatic while it’s happening.",
      "But when the numbers come in and they’re serious — if someone already sees themselves as a person working on this — the hard conversation becomes the next step instead of the end.",
      "He didn’t need to be told food matters. He already knew.",
      "What he needed was a system that understood him well enough to show how his food connected to this specific result — and what a realistic next step looked like from where he actually stood.",
      "This is what I mean when I say meeting people where they are isn’t a philosophy.",
      "It’s the condition that makes hard moments survivable.",
      "The month before the crisis is the product.",
    ],
  },
  {
    title: "The moment I realized I built my health product on a false assumption.",
    date: "Apr 8, 2026",
    tag: "AI + Health",
    topic: "Health",
    summary:
      "A product reflection on affordability, healthcare constraints, and what it really means to meet patients where they are.",
    image: "/images/1.Article.png",
    href: "#health-product-false-assumption",
    content: [
      "The appointment went well. The diagnosis was clear. The prescription was written. And the patient went home… and didn’t fill it.",
      "Not because they didn’t care. Because they couldn’t afford it.",
      "I didn’t learn this from a report. I learned it from my wife — she’s a physician. I asked her a simple question: “What’s the most consistent problem you see in your patients?”",
      'She didn’t mention a disease. She said: "Money." The worst outcomes she sees aren’t from missed diagnoses. They’re from patients who can’t afford the medication she just prescribed.',
      "These are people who are working. People are doing everything “right.” But they earn just enough to not qualify for assistance—and not enough to afford care.",
      "Too poor to afford it. Not poor enough to qualify for help. She called it an epidemic. Not metaphorically. Clinically. And there’s not much she can do about it in a 15-minute appointment.",
      "That conversation broke my product.",
      "I had built a food recommendation system that assumed people had options. Better ingredients. Different meals. Easy swaps. It was well-intentioned. And completely disconnected from reality.",
      "If someone can’t afford quality food, telling them to “eat more salmon” isn’t helpful. It’s insulting. So I had to rethink the system.",
      "Not the features—the assumptions.",
      "The product shouldn’t be built for what people should have. It has to work with what they actually have. So I redesigned the recommendation layer around constraints first:",
      "What’s affordable? What’s already in the house? What small adjustments are actually possible?",
      "Not ideal choices. Real ones.",
      "Then came the harder realization.",
      "The people who need this product most… aren’t the ones who can pay for it. That’s not a product flaw. That’s how the system is structured.",
      "So the model had to change.",
      "The product is built for the patient. But the business model is built for someone else:",
      "Clinics. Health systems. Organizations that serve this population. Because meeting people where they are isn’t just a design principle, in healthcare, it’s a financial one.",
      "Most health tech is built for people with options— insurance, time, money, flexibility.",
      "That’s a real user.",
      "Designing for people with options excludes a large portion of reality—and often the people who need the solution most.",
      "Who are you actually building for?",
    ],
  },
];

export default function Articles() {
  return (
    <div className="min-h-screen bg-cream max-w-[1440px] mx-auto">
      <Nav />

      <section className="px-5 md:px-28 pt-8 md:pt-14 pb-10 md:pb-14">
        <FadeUp delay={0.2}>
          <h1 className="font-[family-name:var(--font-playfair)] font-bold text-[33px] md:text-[45px] leading-[40px] md:leading-[52px] text-green-heading mb-6 md:mb-8 max-w-[900px]">
            Designing AI systems people trust — from experimentation to real-world adoption.
          </h1>
        </FadeUp>
        <FadeUp delay={0.4}>
          <div className="font-[family-name:var(--font-roboto)] text-base md:text-[17px] leading-[28px] md:leading-[35px] text-black/50 max-w-[782px] flex flex-col gap-4">
            <p>I design and test AI-powered experiences at both enterprise scale and from scratch—focused on what actually works, what breaks, and how people respond in real use.</p>
            <p>Through hands-on experiments, I&apos;m learning what it takes to make AI systems not just functional, but trustworthy.</p>
          </div>
        </FadeUp>
      </section>

      <ArticlesClient articles={articles} />

      <Footer />
    </div>
  );
}
