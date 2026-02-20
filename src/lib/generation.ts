import Anthropic from "@anthropic-ai/sdk";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak,
  BorderStyle,
} from "docx";
import { Resend } from "resend";
import type { FormData } from "@/app/questionnaire/types";

function getAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log("ANTHROPIC_API_KEY present:", !!apiKey, "length:", apiKey?.length, "starts with:", apiKey?.substring(0, 10));
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY environment variable is not set");
  }
  return new Anthropic({ apiKey });
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY!);
}

// -- Status update callback type --

export type StatusCallback = (status: {
  status: string;
  step: string;
}) => void;

// -- Prompt construction --

function buildFamilyProfile(data: FormData): string {
  let profile = `FAMILY PROFILE\n`;
  profile += `Family Name: ${data.familyName}\n`;
  profile += `Location: ${data.location}\n`;
  profile += `Description: ${data.description}\n\n`;

  profile += `FAMILY MEMBERS:\n`;
  for (const m of data.members) {
    profile += `- ${m.name} (${m.role || "unspecified role"}, age ${m.age || "unspecified"})\n`;
    if (m.occupation) profile += `  Occupation: ${m.occupation}\n`;
    if (m.personalityType) profile += `  Personality: ${m.personalityType}\n`;
    if (m.interests.length) profile += `  Interests: ${m.interests.join(", ")}\n`;
    if (m.strengths) profile += `  Strengths: ${m.strengths}\n`;
    if (m.challenges) profile += `  Challenges: ${m.challenges}\n`;
    if (m.additionalDetails) profile += `  Additional: ${m.additionalDetails}\n`;
  }

  profile += `\nHOME & LIFESTYLE:\n`;
  profile += `Perfect Weekend: ${data.perfectWeekend}\n`;
  profile += `Traditions: ${data.traditions}\n`;
  profile += `Financial Approach: ${data.financialApproach}\n`;
  profile += `Travel Preferences: ${data.travelPreferences}\n`;

  profile += `\nVALUES & PRIORITIES:\n`;
  profile += `Concerns about the future: ${data.futureConcerns.join(", ")}\n`;
  profile += `Core values: ${data.coreValues.join(", ")}\n`;
  profile += `Legacy: ${data.legacy}\n`;

  return profile;
}

export function buildPrompt(data: FormData): string {
  const children = data.members.filter((m) => m.role === "child");
  const adults = data.members.filter((m) => m.role === "parent" || m.role === "partner");

  return `You are an expert family counselor, educator, and technology ethicist writing a deeply personalized guidebook for a real family. Write with warmth, honesty, and sophistication — like a wise friend who also happens to be an expert. Avoid jargon, marketing-speak, and generic advice. Every section should feel like it was written specifically for this family.

${buildFamilyProfile(data)}

---

Write "The Rooted Family Guidebook" for the ${data.familyName} family. Use the following structure. Write substantial, rich content for each section — this is a full guidebook, not a summary. Aim for approximately 8,000-12,000 words total.

Use this exact structure with these exact section headings:

# The ${data.familyName} Family Guidebook
## A Personalized Field Guide for Navigating the Age of AI

INTRODUCTION
Write a warm, personal introduction that reflects back what you learned about this family. Make them feel seen. Reference their values, their description of themselves, and what they care about. Set the tone that this guidebook is their companion — not a rulebook.

CHAPTER 1: AN HONEST ASSESSMENT — WHERE YOUR FAMILY STANDS TODAY
Provide a candid, compassionate snapshot of where this family currently stands in relation to AI and technology. Based on their ages, interests, concerns, and lifestyle, assess:
- What they're likely already doing well
- Where blind spots might exist
- What their children's developmental stages mean for AI exposure
- How their stated values align (or may conflict) with their current tech habits
Be honest but never harsh. This is a mirror, not a judgment.

CHAPTER 2: YOUR FAMILY'S 3-PHASE TRANSITION PLAN
Create a concrete, phased plan tailored to this family:

Phase 1 — Foundation (Months 1-2): Quick wins and foundational conversations. What to do this week, this month. Specific to their children's ages and the family's rhythm.

Phase 2 — Building (Months 3-4): Deeper work. Introducing frameworks, building new habits, having harder conversations. Tailored to their concerns and values.

Phase 3 — Sustaining (Months 5-6 and beyond): How to maintain momentum, adapt as AI evolves, and build family resilience. Include quarterly check-in suggestions.

${children.map((child) => `CHAPTER: ${child.name.toUpperCase()}'S GUIDE — NAVIGATING AI AT AGE ${child.age || "THEIR AGE"}
Write a dedicated chapter for ${child.name}. Consider their age (${child.age}), personality (${child.personalityType || "not specified"}), interests (${child.interests.join(", ") || "not specified"}), strengths (${child.strengths || "not specified"}), and challenges (${child.challenges || "not specified"}).

Include:
- Age-appropriate AI literacy concepts ${child.name} should understand
- Specific AI tools that could help with their interests (and ones to avoid or use carefully)
- Conversation starters for ${adults.map((a) => a.name).join(" and ") || "parents"} to use with ${child.name}
- Warning signs to watch for at this age
- How to nurture ${child.name}'s strengths while addressing challenges in an AI-saturated world
- **${child.name}'s Essential Practices**: 3-5 daily/weekly habits tailored to ${child.name}'s age, personality, and interests that will build a healthy relationship with technology
- **${child.name}'s Personal Mantra**: Write a short, memorable personal mantra (1-2 sentences) that captures ${child.name}'s unique relationship with technology and the future — something they could put on their wall or repeat to themselves. Make it age-appropriate, empowering, and deeply personal to who they are.
`).join("\n")}

${adults.map((adult) => `CHAPTER: ${adult.name.toUpperCase()}'S GUIDE
Write a dedicated chapter for ${adult.name}. Consider their role (${adult.role}), occupation (${adult.occupation || "not specified"}), personality (${adult.personalityType || "not specified"}), interests (${adult.interests.join(", ") || "not specified"}), strengths (${adult.strengths || "not specified"}), and challenges (${adult.challenges || "not specified"}).

Include:
- Their own relationship with AI and technology
- How to model healthy tech behavior for the family
- Professional implications of AI relevant to ${adult.occupation || "their work"}
- Self-care in the age of information overload
- **${adult.name}'s Essential Practices**: 3-5 daily/weekly habits tailored to ${adult.name} that will help them lead the family's technology journey
- **${adult.name}'s Personal Mantra**: Write a short, memorable personal mantra (1-2 sentences) that captures ${adult.name}'s unique role in guiding this family through the age of AI. Make it empowering, personal, and something they'd want to return to.
`).join("\n")}

${adults.length > 1 ? `CHAPTER: CO-PARENTING IN THE AGE OF AI
Address strategies for ${adults.map((a) => a.name).join(" and ")} to stay aligned:
- Building consistent tech boundaries as a team
- Handling disagreements about screen time and AI use
- Supporting each other when tech-parenting feels overwhelming
` : ""}

CHAPTER: THE ${data.familyName.toUpperCase()} FAMILY PLAYBOOK
This is the shared chapter — the one the whole family reads together. Write it in an accessible, warm tone that works for every age in the family. Include:
- **Our Family's AI Principles**: 5-7 principles distilled from their values (${data.coreValues.join(", ")}) that guide how this family uses technology. Write them as "We..." statements.
- **The ${data.familyName} Weekly Reset**: A specific weekly ritual (15-30 minutes) for the family to check in on their tech habits together. Tailor it to their traditions (${data.traditions}) and what their perfect weekend looks like (${data.perfectWeekend}).
- **Dinner Table Questions**: 10 conversation starters about AI and technology designed for this specific family — ranging from fun and light to deep and thought-provoking. Reference the family members by name.
- **Our Shared Mantra**: Write one family mantra that captures the ${data.familyName} family's collective spirit and approach to navigating the future together. This should feel like something they'd put on their refrigerator.

CHAPTER: YOUR FAMILY TECHNOLOGY AGREEMENT
Draft a complete, ready-to-use family technology agreement specifically for the ${data.familyName} family. Base it on their values (${data.coreValues.join(", ")}), their concerns (${data.futureConcerns.join(", ")}), and their traditions (${data.traditions}). Make it feel like something they would actually want to sign — warm but clear, with specific commitments for each family member by name.

CHAPTER: RESOURCES & RECOMMENDED TOOLS
Provide curated recommendations organized by category:
- AI tools appropriate for each family member (by name and age)
- Apps and tools to avoid (and why)
- Books, podcasts, and websites for continued learning
- Community resources relevant to ${data.location || "their area"}

CLOSING LETTER
Write a brief, heartfelt closing letter to the ${data.familyName} family. Reference their legacy statement: "${data.legacy}". End on a note of confidence and warmth.

---

FORMATTING RULES:
- Use # for the document title
- Use ## for chapter titles
- Use ### for section headings within chapters
- Use **bold** for emphasis
- Use bullet points with - for lists
- Use numbered lists with 1. 2. 3. for sequential steps
- Separate chapters with ---
- Do NOT use any other formatting`;
}

// -- Markdown to DOCX conversion --

const COLORS = {
  warm900: "2a221b",
  warm700: "5c4f3d",
  warm500: "9c8a72",
  terra: "b5694d",
  sage700: "4a5c40",
};

function parseMarkdownToDocx(markdown: string): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const lines = markdown.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "---") {
      paragraphs.push(new Paragraph({ children: [new PageBreak()] }));
      i++;
      continue;
    }

    if (line.trim() === "") {
      i++;
      continue;
    }

    if (line.startsWith("# ")) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.slice(2).trim(),
              font: "Georgia",
              size: 56,
              color: COLORS.warm900,
              bold: true,
            }),
          ],
          spacing: { after: 200 },
          alignment: AlignmentType.CENTER,
        })
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      if (paragraphs.length > 0) {
        paragraphs.push(new Paragraph({ children: [new PageBreak()] }));
      }
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.slice(3).trim(),
              font: "Georgia",
              size: 40,
              color: COLORS.terra,
              bold: true,
            }),
          ],
          spacing: { before: 480, after: 240 },
          alignment: AlignmentType.CENTER,
        })
      );
      paragraphs.push(
        new Paragraph({
          border: {
            bottom: {
              style: BorderStyle.SINGLE,
              size: 4,
              color: COLORS.warm500,
              space: 8,
            },
          },
          spacing: { after: 360 },
        })
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: line.slice(4).trim(),
              font: "Georgia",
              size: 28,
              color: COLORS.sage700,
              bold: true,
            }),
          ],
          spacing: { before: 360, after: 160 },
        })
      );
      i++;
      continue;
    }

    if (/^\d+\.\s/.test(line.trim())) {
      const match = line.trim().match(/^(\d+)\.\s(.*)$/);
      if (match) {
        paragraphs.push(
          new Paragraph({
            children: formatInlineMarkdown(`${match[1]}. ${match[2]}`),
            spacing: { after: 80 },
            indent: { left: 360 },
          })
        );
      }
      i++;
      continue;
    }

    if (line.trim().startsWith("- ")) {
      const content = line.trim().slice(2);
      paragraphs.push(
        new Paragraph({
          children: formatInlineMarkdown(content),
          bullet: { level: 0 },
          spacing: { after: 80 },
        })
      );
      i++;
      continue;
    }

    paragraphs.push(
      new Paragraph({
        children: formatInlineMarkdown(line.trim()),
        spacing: { after: 200 },
        indent: { firstLine: 0 },
      })
    );
    i++;
  }

  return paragraphs;
}

function formatInlineMarkdown(text: string): TextRun[] {
  const runs: TextRun[] = [];
  const parts = text.split(/(\*\*.*?\*\*)/g);

  for (const part of parts) {
    if (part.startsWith("**") && part.endsWith("**")) {
      runs.push(
        new TextRun({
          text: part.slice(2, -2),
          font: "Palatino Linotype",
          size: 22,
          color: COLORS.warm900,
          bold: true,
        })
      );
    } else if (part) {
      runs.push(
        new TextRun({
          text: part,
          font: "Palatino Linotype",
          size: 22,
          color: COLORS.warm700,
        })
      );
    }
  }

  return runs;
}

function buildDocx(markdown: string, familyName: string): Document {
  const contentParagraphs = parseMarkdownToDocx(markdown);

  return new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Palatino Linotype",
            size: 22,
            color: COLORS.warm700,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 2880, right: 1440, bottom: 2880, left: 1440 },
          },
        },
        children: [
          new Paragraph({ spacing: { before: 3600 } }),
          new Paragraph({
            children: [
              new TextRun({ text: "The", font: "Georgia", size: 32, color: COLORS.warm500 }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: `${familyName} Family`, font: "Georgia", size: 72, color: COLORS.warm900, bold: true }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Guidebook", font: "Georgia", size: 72, color: COLORS.warm900, bold: true }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 320 },
          }),
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: COLORS.terra, space: 1 } },
            alignment: AlignmentType.CENTER,
            indent: { left: 2880, right: 2880 },
            spacing: { after: 320 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "A Personalized Field Guide", font: "Georgia", size: 28, color: COLORS.warm500, italics: true }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "for Navigating the Age of AI", font: "Georgia", size: 28, color: COLORS.warm500, italics: true }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: contentParagraphs,
      },
    ],
  });
}

// -- Full generation pipeline (streaming status via callback) --

export async function runGeneration(
  formData: FormData,
  email: string,
  onStatus?: StatusCallback
): Promise<void> {
  const notify = onStatus || (() => {});

  // Step 1: Generate with Claude
  notify({ status: "generating", step: "Writing your family\u2019s guidebook..." });
  const prompt = buildPrompt(formData);

  const message = await getAnthropic().messages.create({
    model: "claude-opus-4-6",
    max_tokens: 16000,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text content in Claude response");
  }
  const guidebookMarkdown = textBlock.text;

  // Step 2: Build DOCX
  notify({ status: "formatting", step: "Formatting your guidebook..." });
  const familyName = formData.familyName || "Your";
  const doc = buildDocx(guidebookMarkdown, familyName);
  const buffer = await Packer.toBuffer(doc);

  // Step 3: Send email
  notify({ status: "sending", step: "Sending to your inbox..." });
  const filename = `${familyName.replace(/[^a-zA-Z0-9]/g, "-")}-Family-Guidebook.docx`;

  await getResend().emails.send({
    from: "The Rooted Family Guidebook <onboarding@resend.dev>",
    to: email,
    subject: `Your ${familyName} Family Guidebook is Ready`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #3d3229;">
        <h1 style="color: #2a221b; font-size: 24px; font-weight: normal;">
          Your guidebook is here.
        </h1>
        <p style="color: #5c4f3d; line-height: 1.7; font-size: 16px;">
          Hi ${familyName} family,
        </p>
        <p style="color: #5c4f3d; line-height: 1.7; font-size: 16px;">
          We've crafted a personalized field guide just for your family.
          Your guidebook is attached as a Word document \u2014 feel free to print it,
          share it with your family, or keep it as a digital reference.
        </p>
        <p style="color: #5c4f3d; line-height: 1.7; font-size: 16px;">
          This is the beginning of a more intentional relationship with
          technology. We're rooting for you.
        </p>
        <p style="color: #9c8a72; font-size: 14px; margin-top: 32px;">
          \u2014 The Rooted Family Team
        </p>
      </div>
    `,
    attachments: [
      {
        filename,
        content: buffer.toString("base64"),
        contentType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    ],
  });

  // Done
  notify({ status: "done", step: "Complete!" });
}
