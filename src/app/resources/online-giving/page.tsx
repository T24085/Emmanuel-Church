import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon } from "@/components/icons";
import { SectionShell } from "@/components/section";
import { givingPrinciples } from "@/data/giving";
import { site } from "@/data/site";
import { withBasePath } from "@/lib/site-path";

const givingFaq = [
  {
    question: "How do I give online?",
    answer:
      "Select any Give Now button on this page to open Emmanuel's Fellowship One Giving portal. From there, you can make a gift securely online.",
  },
  {
    question: "Can I make a one-time or recurring gift?",
    answer:
      "Yes. Fellowship One Giving supports both one-time gifts and recurring support, so you can choose the rhythm that best fits your generosity journey.",
  },
  {
    question: "Can I choose whether to cover processing fees?",
    answer:
      "Yes. The giving portal provides an option to cover processing fees when you make your gift.",
  },
  {
    question: "Can I manage my giving online?",
    answer:
      "Yes. Fellowship One Giving lets you manage your giving account and review your gifts in one place.",
  },
  {
    question: "Who do I contact if I need help?",
    answer: (
      <>
        For help with giving, login access, or receipts, please reach out through the church's{" "}
        <Link href="/contact">contact page</Link> and our team will help connect you with the right person.
      </>
    ),
  },
];

export default function OnlineGivingPage() {
  return (
    <>
      <a
        className="giving-fab"
        href={site.givingHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Start Your Journey Today"
      >
        <span>Start Your Journey Today</span>
        <ArrowRightIcon className="icon icon--xs" />
      </a>

      <SectionShell className="section-shell--giving">
        <section className="giving-hero" aria-labelledby="giving-hero-title">
          <div className="giving-hero__media" aria-hidden="true">
            <Image
              src={withBasePath("/images/giving/giving-jesus.png")}
              alt=""
              fill
              sizes="100vw"
              className="cover-image"
              priority
            />
          </div>
          <div className="giving-hero__layout site-shell">
            <div className="giving-hero__content">
              <p className="eyebrow">Giving</p>
              <h1 id="giving-hero-title">Generosity is Part of Discipleship.</h1>
              <p>
                God is the giver of every good gift, so we trust Him with everything He has
                entrusted to us. We respond by giving through the local church as an act of
                worship. Giving is more than a transaction - it is a matter of the heart and
                an essential part of our discipleship journey. As we seek first His Kingdom
                through generous living, God transforms us and uses our faithfulness to make
                an eternal difference. What begins as obedience becomes joy, creating Kingdom
                impact that reaches far beyond ourselves.
              </p>
              <div className="hero__actions giving-hero__actions">
                <a className="button button--gold" href={site.givingHref} target="_blank" rel="noreferrer">
                  Give Now
                </a>
                <Link className="button button--light" href="/contact">
                  <span>Need help?</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <div className="site-shell giving-foundation-shell">
          <section className="giving-foundation" aria-labelledby="giving-foundation-title">
            <div className="giving-foundation__heading">
              <p className="eyebrow">Why we give</p>
              <h2 id="giving-foundation-title">Generosity is Worship in Motion.</h2>
              <p>
                We do not give because God needs something from us. We give because God is
                accomplishing something through us and within us. As we faithfully steward all He
                has entrusted to us, our worship deepens, our hearts are transformed, and His
                Kingdom advances.
              </p>
            </div>

            <ol className="giving-foundation__list">
              {givingPrinciples.map((principle, index) => (
                <li className="giving-foundation__item" key={principle.id}>
                  <span className="giving-foundation__marker" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="giving-foundation__body">
                    <p className="giving-foundation__principle">{principle.lens}</p>
                    <h3>{principle.title}</h3>
                    <p>{principle.summary}</p>
                  </div>
                  <div className="giving-foundation__scriptures" aria-label={`${principle.title} scripture`}>
                    <p className="eyebrow eyebrow--small">Scripture · KJV</p>
                    {principle.scriptures.map((scripture) => (
                      <blockquote key={scripture.reference}>
                        <p>“{scripture.text}”</p>
                        <cite>{scripture.reference}</cite>
                      </blockquote>
                    ))}
                  </div>
                </li>
              ))}
            </ol>
            <p className="giving-foundation__transition">
              Generosity begins with what God has already given.
            </p>
          </section>
        </div>
        <section className="giving-faq site-shell" aria-labelledby="giving-faq-title">
          <div className="giving-faq__heading">
            <p className="eyebrow">Questions?</p>
            <h2 id="giving-faq-title">A few helpful answers.</h2>
            <p>
              Find quick answers about online giving, recurring gifts, processing fees, and getting
              support.
            </p>
          </div>
          <div className="giving-faq__list">
            {givingFaq.map((item, index) => (
              <details className="giving-faq__item" key={item.question} open={index === 0}>
                <summary>
                  <span>{item.question}</span>
                  <span className="giving-faq__icon" aria-hidden="true">+</span>
                </summary>
                <div className="giving-faq__answer">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </SectionShell>
    </>
  );
}
