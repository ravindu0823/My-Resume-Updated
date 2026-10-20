import type { Job } from "./schema.ts";

// Source: CV. Owner ruling 2026-10-21: follow the CV. Techwire Lanka is the employer and 747 Live
// is a client, described neutrally. The live site's "Amplify Solutions" and "747 Live" employer
// entries are deliberately not carried over.
export const experience: Job[] = [
  {
    company: "Techwire Lanka (Pvt) Ltd",
    note: "Platforms for clients including 747 Live.",
    roles: [
      {
        title: "Software Engineer",
        period: { start: "2024-08", end: "present" },
        bullets: [
          "Lead engineer on a high-scale social engagement and real-time content platform (.NET 10, Aspire): feeds, stories, real-time chat and live streaming, built for high-frequency fan-out with CQRS, Redis caching and event-driven messaging.",
          "Core engineer on a multi-tenant agent-network and commission platform (.NET 9, Aspire): a 10-level hierarchy, an automated commission engine and a central identity and permission hub for peer microservices.",
          "Contributing engineer on a multi-currency wallet and double-entry ledger with exactly-once idempotency, HMAC-signed partner APIs and Serializable transactions for financial correctness.",
          "Built supporting services and tooling: a real-time event-data and settlement platform, a multi-tenant crypto and payment gateway, and a reusable .NET 10 API template adopted across the team.",
          "Delivered on Azure (Container Apps, Service Bus, APIM, Blob) with Bicep and Azure DevOps / GitHub Actions pipelines; observability with Serilog, OpenTelemetry and Sentry.",
        ],
        stack: [".NET 10", "ASP.NET Core", "Aspire", "PostgreSQL", "Redis", "RabbitMQ", "Azure"],
      },
      {
        title: "Associate Software Engineer",
        period: { start: "2023-12", end: "2024-08" },
        bullets: [
          "Built an inventory management web application for CEB's Lakvijaya Power Plant with ASP.NET Core and EF Core.",
          "Built a hospital management web application for Kumudu Hospital with ASP.NET Core and EF Core, deployed on Microsoft Azure.",
        ],
        stack: ["ASP.NET Core", "EF Core", "SQL Server", "Azure", "Docker"],
      },
    ],
  },
  {
    company: "EXE.lk",
    location: "Homagama, Sri Lanka",
    roles: [
      {
        title: "Software Engineer Intern (R&D)",
        period: { start: "2022-11", end: "2023-05" },
        bullets: [
          "Developed machine-learning-based web and mobile applications with ASP.NET Framework, TensorFlow, MediaPipe and MySQL.",
          "Worked across backend and frontend on products built from scratch, including several dashboards.",
        ],
        stack: ["ASP.NET", "TensorFlow", "MediaPipe", "Python", "React", "MySQL"],
      },
    ],
  },
];
