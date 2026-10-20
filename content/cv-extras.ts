import type { CvExtras } from "./schema.ts";

// The CV's skills summary, printed on the PDF resume. Source: CV "Skills".
export const cvExtras: CvExtras = {
  skills: [
    { label: "Languages", value: "C#, TypeScript, JavaScript, Java, Python, PHP, SQL" },
    {
      label: "Frameworks",
      value: "ASP.NET Core, EF Core, .NET Aspire, Blazor, SignalR, Spring Boot, Hibernate, React, Next.js, Node.js, Express, Fastify, Tailwind CSS, TensorFlow",
    },
    { label: "Architecture", value: "Microservices, Clean Architecture, DDD, CQRS, event-driven systems, REST APIs, WebSockets/SignalR, CI/CD, Agile, TDD" },
    { label: "Data & messaging", value: "SQL Server, PostgreSQL, MongoDB, MySQL, Redis, RabbitMQ / MassTransit, Hangfire" },
    {
      label: "Cloud & DevOps",
      value: "Azure (Container Apps, App Service, Service Bus, APIM, Blob, SignalR), Docker, GitHub Actions, Azure DevOps, Bicep, Dokploy, DigitalOcean, OpenTelemetry, Serilog",
    },
    { label: "Tools", value: "Git, Postman, Jira" },
    { label: "Soft skills", value: "Problem-solving, technical communication, teamwork, time management" },
  ],
};
