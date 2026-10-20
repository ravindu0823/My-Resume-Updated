import type { StackGroup } from "./schema.ts";

// Same groups and logos as the GitHub README stack cards (ravindu0823/ravindu0823, scripts/stack.mjs).
// `icon` is a devicon id vendored into public/icons by scripts/images.mjs; no icon renders as a chip.
export const stack: StackGroup[] = [
  {
    title: "Backend",
    caption: "C# and .NET first",
    items: [
      { name: "C#", icon: "csharp" },
      { name: ".NET", icon: "dotnetcore" },
      { name: "ASP.NET Core" },
      { name: "Aspire" },
      { name: "EF Core" },
      { name: "SignalR" },
      { name: "Blazor", icon: "blazor" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Node.js", icon: "nodejs" },
      { name: "Python", icon: "python" },
      { name: "Java", icon: "java" },
      { name: "Spring", icon: "spring" },
    ],
  },
  {
    title: "Data & messaging",
    caption: "SQL, cache, queues",
    items: [
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "SQL Server", icon: "microsoftsqlserver" },
      { name: "Redis", icon: "redis" },
      { name: "RabbitMQ", icon: "rabbitmq" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "MySQL", icon: "mysql" },
      { name: "Service Bus" },
      { name: "MassTransit" },
      { name: "Hangfire" },
    ],
  },
  {
    title: "Cloud & DevOps",
    caption: "Azure first",
    items: [
      { name: "Azure", icon: "azure" },
      { name: "Azure DevOps", icon: "azuredevops" },
      { name: "Docker", icon: "docker" },
      { name: "Kubernetes", icon: "kubernetes" },
      { name: "GitHub Actions", icon: "githubactions" },
      { name: "Terraform", icon: "terraform" },
      { name: "Bicep" },
      { name: "Container Apps" },
      { name: "Dokploy" },
      { name: "Linux", icon: "linux" },
    ],
  },
  {
    title: "Frontend, ML & observability",
    caption: "UI, models, telemetry",
    items: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
      { name: "Tailwind CSS", icon: "tailwindcss" },
      { name: "Flutter", icon: "flutter" },
      { name: "TensorFlow", icon: "tensorflow" },
      { name: "OpenTelemetry", icon: "opentelemetry" },
      { name: "Sentry", icon: "sentry" },
      { name: "ML.NET" },
      { name: "Serilog" },
    ],
  },
];
