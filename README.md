# LinguaTash

LinguaTash is 
a content-driven website focused on language learning, multilingual parenting, and natural language acquisition.  
The project combines long-form educational content, practical resources, and course offerings, built with modern web technologies for performance, accessibility, and scalability.

This site is built using **Next.js**, **Tailwind CSS**, and **MDX**, and is deployed on **Vercel**.

---

## ✨ Features

- ⚡️ Fast, SEO-friendly static site generation with Next.js
- ✍️ Content written in MDX (Markdown + React components)
- 🎨 Styled with Tailwind CSS and Typography plugin
- 🌗 Light / Dark mode support
- 🧠 Blog-first architecture for long-form educational content
- 📱 Fully responsive design
- 🚀 Continuous deployment via Vercel
- 🔎 Built-in support for tags, RSS, and metadata

---

## 📁 Project Structure

```text
.
├── app/                # Next.js App Router pages
│   ├── page.tsx        # Home page
│   ├── blog/           # Blog index and routes
│   ├── about/          # About page
│   ├── courses/        # Courses & offerings
│   └── now/            # /now page (current focus & updates)
├── data/
│   ├── blog/           # MDX blog posts
│   ├── siteMetadata.js # Site-wide configuration & SEO
│   └── headerNavLinks.ts
├── components/         # Reusable React components
├── layouts/            # Page and post layouts
├── public/             # Static assets
└── styles/             # Global styles
```
