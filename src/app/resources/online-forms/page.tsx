import Image from "next/image";
import { ArrowRightIcon } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { ResourceTabs } from "@/components/resource-tabs";
import { SectionHeading, SectionShell } from "@/components/section";
import { onlineForms } from "@/data/online-forms";

export default function OnlineFormsPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Online Forms"
        description="Use these forms to connect with the church, plan an event, request support, or submit a scholarship application."
      />

      <ResourceTabs active="online-forms" />

      <SectionShell>
        <SectionHeading
          eyebrow="Get connected"
          title="One Place for Church Requests."
          description="Choose the form that fits your need. Forms open in Fellowship One Go, Emmanuel's church administration platform."
        />
        <div className="forms-grid">
          {onlineForms.map((form) => (
            <a className="form-card" href={form.href} target="_blank" rel="noreferrer" key={form.href}>
              <div className="form-card__media">
                <Image
                  src={form.image}
                  alt={`${form.title} graphic`}
                  width={625}
                  height={625}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="form-card__body">
                <p className="eyebrow eyebrow--small">{form.eyebrow}</p>
                <h3>{form.title}</h3>
                <p>{form.description}</p>
                <span className="form-card__action">
                  <span>Open form</span>
                  <ArrowRightIcon className="icon icon--xs" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </SectionShell>

      <SectionShell className="section-shell--tight">
        <div className="inline-banner">
          <div className="inline-banner__copy">
            <p className="eyebrow">Need help?</p>
            <h2>Questions About a Form?</h2>
            <p>Call the church office at (785) 263-3342 and we will help you find the right next step.</p>
          </div>
          <a className="button button--gold" href="tel:7852633342">
            Call the church office
          </a>
        </div>
      </SectionShell>
    </>
  );
}
