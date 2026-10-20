import type { Profile } from "./schema.ts";

// Source: CV (D:/747/Claude/Ravindu Dhanushka.docx). Links verified for the GitHub README, 2026-10-21.
export const profile: Profile = {
  name: "Ravindu Dhanushka Perera",
  shortName: "Ravindu",
  role: "Software Engineer · .NET & Azure",
  location: "Piliyandala, Sri Lanka",
  summary:
    "Software engineer with 3+ years' experience across full-stack and backend development: .NET microservices, real-time platforms and machine-learning applications. I hold a First-Class Honours BSc in Software Engineering, design production-grade systems with Clean Architecture, event-driven microservices and secure APIs, ship them cloud-native on Azure, and pick up new technologies quickly.",
  photo: { src: "/img/ravindu", width: 480, height: 541, alt: "Portrait of Ravindu Dhanushka Perera" },
  links: [
    { kind: "email", label: "dhanushka114@outlook.com", href: "mailto:dhanushka114@outlook.com", primary: true },
    { kind: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/ravindu-dhanushka/", primary: true },
    { kind: "github", label: "GitHub", href: "https://github.com/ravindu0823", primary: true },
    { kind: "portfolio", label: "ravinduperera.vercel.app", href: "https://ravinduperera.vercel.app/" },
    { kind: "x", label: "X", href: "https://x.com/RavinduDhanush4" },
    { kind: "devto", label: "dev.to", href: "https://dev.to/ravindu0823" },
    { kind: "stackoverflow", label: "Stack Overflow", href: "https://stackoverflow.com/users/16387999/night-fury" },
    { kind: "tryhackme", label: "TryHackMe", href: "https://tryhackme.com/p/ravindu0823" },
    { kind: "instagram", label: "Instagram", href: "https://www.instagram.com/_d_h_a_n_u_23/" },
    { kind: "facebook", label: "Facebook", href: "https://www.facebook.com/muditha.warawita/" },
    { kind: "discord", label: "Discord", href: "https://discord.com/users/601340478104928275" },
  ],
  highlights: [
    { value: "3+ years", label: "shipping production software" },
    { value: "First Class", label: "BSc (Hons) Software Engineering" },
    { value: "~90%", label: "of 480+ commits as lead on a real-time platform" },
    { value: "14 PRs", label: "merged into frag-arena, a 3D multiplayer FPS" },
  ],
};
