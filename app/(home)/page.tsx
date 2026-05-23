import Link from 'next/link';

const sections: { title: string; href: string; description: string }[] = [
  {
    title: 'API reference',
    href: '/docs/api',
    description:
      'Every REST endpoint, auto-generated from the OpenAPI spec. Bearer auth, idempotency keys, RFC 7807 errors.',
  },
  {
    title: 'MCP server',
    href: '/docs/mcp/quickstart',
    description:
      'Connect AI agents to thesignup via the hosted MCP server at mcp.thesignup.com/mcp.',
  },
  {
    title: 'TypeScript SDK',
    href: '/docs/sdks/typescript',
    description: 'Typed client for the REST API. Coming soon.',
  },
  {
    title: 'CLI',
    href: '/docs/cli',
    description:
      'Manage your account, keys, and resources from the terminal. Coming soon.',
  },
  {
    title: 'Authentication',
    href: '/docs/auth/api-keys',
    description: 'API keys and OAuth for first-party and third-party access.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1 max-w-3xl mx-auto px-6 py-16 gap-10">
      <header className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-wide text-fd-muted-foreground">
          Developer documentation
        </p>
        <h1 className="text-4xl font-bold tracking-tight">thesignup docs</h1>
        <p className="text-lg text-fd-muted-foreground">
          REST API, MCP server, SDKs, and CLI references for thesignup.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <li key={s.href}>
            <Link
              href={s.href}
              className="block rounded-lg border p-4 hover:bg-fd-accent transition-colors h-full"
            >
              <h2 className="font-medium mb-1">{s.title}</h2>
              <p className="text-sm text-fd-muted-foreground">{s.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
