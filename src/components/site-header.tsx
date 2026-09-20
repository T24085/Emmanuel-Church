"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, site } from "@/data/site";
import { withBasePath } from "@/lib/site-path";
import { ArrowRightIcon, CloseIcon, MenuIcon } from "./icons";

function isActive(pathname: string, href: string) {
  pathname = pathname.replace(/\/$/, "") || "/";
  if (href === "/resources" || href === "/resources/bulletin") {
    return pathname === "/resources" || pathname.startsWith("/resources/");
  }
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (mobileMenuRef.current) {
      mobileMenuRef.current.open = false;
    }
  }, [pathname]);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileMenuRef.current?.open) {
        mobileMenuRef.current.open = false;
        mobileMenuRef.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  const closeMobileMenu = () => {
    if (mobileMenuRef.current) {
      mobileMenuRef.current.open = false;
    }
  };

  return (
    <header className="site-header">
      <div className="site-shell site-header__inner">
        <Link href="/" className="brand" aria-label={site.name}>
          <Image
            src={withBasePath("/images/emmanuel-church-logo.png")}
            alt="Emmanuel Church"
            width={220}
            height={85}
            className="brand__logo"
            priority
          />
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {primaryNav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`site-nav__link${active ? " site-nav__link--active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="site-header__actions">
          <Link href="/contact" className="button button--gold">
            Plan Your Visit
          </Link>
        </div>

        <details ref={mobileMenuRef} className="mobile-menu">
          <summary className="mobile-menu__summary" aria-label="Navigation menu">
            <MenuIcon className="icon icon--sm" />
            <CloseIcon className="icon icon--sm mobile-menu__close" />
          </summary>
          <div className="mobile-menu__panel">
            <div className="mobile-menu__top">
              <Link
                href="/"
                className="mobile-menu__brand"
                aria-label={site.name}
                onClick={closeMobileMenu}
              >
                <Image
                  src={withBasePath("/images/emmanuel-church-logo.png")}
                  alt="Emmanuel Church"
                  width={220}
                  height={85}
                  className="brand__logo"
                />
              </Link>
              <Link href="/contact" className="button button--gold button--small" onClick={closeMobileMenu}>
                Plan Visit
              </Link>
            </div>
            <nav className="mobile-menu__nav" aria-label="Mobile">
              {primaryNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`mobile-menu__link${active ? " mobile-menu__link--active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                    <ArrowRightIcon className="icon icon--xs" />
                  </Link>
                );
              })}
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
