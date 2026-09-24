import Link from "next/link";

const links = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/tienda", label: "Tienda" },
  { href: "/#nosotros", label: "Nosotros" },
  { href: "/blog", label: "Blog" },
  { href: "/#contacto", label: "Contacto" },
];

export function Nav({ className }: { className?: string }) {
  return (
    <nav className={className}>
      <ul className="flex items-center gap-6 text-sm font-medium">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
