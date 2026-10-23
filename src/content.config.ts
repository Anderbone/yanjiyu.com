import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const commonFields = {
  title: z.string(),
  description: z.string(),
  meta_title: z.string().optional(),
  // z.coerce.date() handles both Date objects and ISO string dates from frontmatter (Zod 4)
  date: z.coerce.date().optional(),
  image: z.string().optional(),
  toc: z.boolean().optional(),
  draft: z.boolean(),
};

const postSchema = z.object({
  title: z.string(),
  meta_title: z.string().optional(),
  description: z.string().optional(),
  date: z.coerce.date().optional(),
  image: z.string().optional(),
  author: z.string().default("Jiyu"),
  // Use factory functions for mutable array defaults (Zod 4 best practice)
  categories: z.array(z.string()).default(() => ["others"]),
  tags: z.array(z.string()).default(() => ["others"]),
  pinned: z.boolean().default(false),
  toc: z.boolean().optional(),
  draft: z.boolean().optional(),
});

const createPostCollection = (base: string) =>
  defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base }),
    schema: postSchema,
  });

const devCollection = createPostCollection("src/content/dev");

const journalCollection = createPostCollection("src/content/journal");

const createPageCollection = (base: string) =>
  defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base }),
    schema: z.object(commonFields),
  });

const pagesCollection = createPageCollection("src/content/pages");
const aboutCollection = createPageCollection("src/content/about");
const contactCollection = createPageCollection("src/content/contact");

// Homepage collection schema
const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/-*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({
    banner: z.object({
      title: z.string(),
      content: z.string(),
      image: z.string().optional(),
      button: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
    }),
    features: z
      .array(
        z.object({
          title: z.string(),
          image: z.string(),
          content: z.string(),
          bulletpoints: z.array(z.string()),
          button: z.object({
            enable: z.boolean(),
            label: z.string(),
            link: z.string(),
          }),
        }),
      )
      .default(() => []),
  }),
});

// Call to Action collection schema
const ctaSectionCollection = defineCollection({
  loader: glob({
    pattern: "call-to-action.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    button: z.object({
      enable: z.boolean(),
      label: z.string(),
      link: z.string(),
    }),
  }),
});

// Testimonials Section collection schema
const testimonialSectionCollection = defineCollection({
  loader: glob({
    pattern: "testimonial.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    description: z.string(),
    testimonials: z.array(
      z.object({
        name: z.string(),
        avatar: z.string(),
        designation: z.string(),
        content: z.string(),
      }),
    ),
  }),
});

// Export collections
export const collections = {
  zhDev: createPostCollection("src/content/zh/dev"),
  zhJournal: createPostCollection("src/content/zh/journal"),
  zhPages: createPageCollection("src/content/zh/pages"),
  zhAbout: createPageCollection("src/content/zh/about"),
  zhContact: createPageCollection("src/content/zh/contact"),
  // Pages
  homepage: homepageCollection,
  dev: devCollection,
  journal: journalCollection,
  pages: pagesCollection,
  about: aboutCollection,
  contact: contactCollection,

  // sections
  ctaSection: ctaSectionCollection,
  testimonialSection: testimonialSectionCollection,
};
