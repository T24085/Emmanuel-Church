import Link from "next/link";

type ResourceSection = "bulletin" | "study-guides" | "online-forms" | "spiritual-gifts";

const resourceSections: Array<{
  key: ResourceSection;
  label: string;
  href: string;
}> = [
  { key: "bulletin", label: "Bulletins", href: "/resources/bulletin" },
  {
    key: "study-guides",
    label: "Weekly Sermon Study Guides",
    href: "/resources/weekly-sermon-study-guides",
  },
  { key: "online-forms", label: "Online Forms", href: "/resources/online-forms" },
  {
    key: "spiritual-gifts",
    label: "Spiritual Gifts & Serve",
    href: "/resources/spiritual-gifts-serve-booklet",
  },
];

export function ResourceTabs({ active }: { active: ResourceSection }) {
  return (
    <nav className="resource-tabs-shell" aria-label="Resource sections">
      <div className="site-shell">
        <div className="resource-tabs">
          {resourceSections.map((section) => (
            <Link
              className={`resource-tabs__link${section.key === active ? " resource-tabs__link--active" : ""}`}
              href={section.href}
              key={section.key}
              aria-current={section.key === active ? "page" : undefined}
            >
              {section.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
