import Image from "next/image";
import Link from "next/link";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DoctrineSearch } from "@/components/doctrine-search";
import { site } from "@/data/site";
import { withBasePath } from "@/lib/site-path";
import "./about-redesign.css";

const photos = {
  hero: { src: "/images/heroes/who-we-are-fellowship.jpg", alt: "Emmanuel Church members talking together in the sanctuary", position: "center 56%" },
  fellowship: { src: "/images/who-we-are/fellowship-conversation.jpg", alt: "Three women sharing a conversation at Emmanuel Church", position: "center 46%" },
  worship: { src: "/images/who-we-are/worship-team.jpg", alt: "Musicians singing and leading worship at Emmanuel Church", position: "center 46%" },
  study: { src: "/images/who-we-are/bible-study-together.jpg", alt: "Adults reading open Bibles at Emmanuel Church", position: "center 50%" },
  children: { src: "/images/who-we-are/children.jpg", alt: "A child arranging books during a Sunday morning activity", position: "center 48%" },
} as const;

const values = [
  {
    title: "Love",
    summary: "Love shapes the posture of the church and the way we serve one another.",
    backTitle: "Love transforms people and families",
    backBody: "Love is the foundation of our Mission and the Core Value from which all other Core Values and ministries grow. Love originates with God and is expressed through His people. It is the covering for every motivation and action that we take, make, or create. If we are without God's love, we have little ability to make a difference in the lives of people or families. Others will identify us as Christ followers because of love. God first loved us and because of His love, we can love others.",
    references: "(1 John 4:7-12, 1 Corinthians 13, Matthew 22:36-40)",
    image: "/images/who-we-are/love.png",
  },
  {
    title: "Grace",
    summary: "Grace is God's undeserved gift, made clear in Jesus Christ.",
    backTitle: "Grace transforms people and families",
    backBody: "At Emmanuel Church, we desire to be a people who extend the grace of God to others. Grace is getting something we don’t deserve and is perfectly illustrated in God’s gift of Jesus Christ. Jesus’ death and resurrection are supreme examples of grace. In His death Jesus paid a price for our sins that we simply could not pay. Only the blood of Jesus, given as an offering of grace, can erase our sins. We don’t deserve this precious gift, but He freely offers it to all people. In His resurrection Jesus has overcome death and through grace has paved the way for us to live eternally with Him. We truly are saved through faith because of God’s grace.",
    references: "(John 1:16-17; Ephesians 2:1-10; Romans 3:23-25; Romans 5:17)",
    image: "/images/who-we-are/grace.png",
  },
  {
    title: "Worship",
    summary: "Worship is our response of praise, prayer, generosity, and surrender.",
    backTitle: "Worship transforms people and families",
    backBody: "At Emmanuel Church, we desire to be a people who live a lifestyle of Worship. Worship is our outward and inward expression of thanksgiving and praise to the One who created us. Worship includes corporate and private singing, prayer, giving, and submission to God in all areas of our lives. It is first and foremost a response to who God is and a response to what He’s done for us. Worship is to be a lifestyle that fills our journey with Christ, and not merely a corporate activity. When we worship we put Jesus first and seek to be led by the Holy Spirit as we purposely seek to be in His amazing presence.",
    references: "(Leviticus 26:1; 1 Samuel 12:21; Exodus 34:14; Psalm 29:2; Psalm 81:9; Psalm 99:9; Matthew 4:10; John 4:24)",
    image: "/images/who-we-are/worship.png",
  },
  {
    title: "Truth",
    summary: "God's truth is revealed by the Holy Spirit and lived out with confidence.",
    backTitle: "Truth is illuminated by the Holy Spirit",
    backBody: "At Emmanuel Church, we desire to be a people who are led by the Holy Spirit as He illuminates God’s Truth. The Holy Spirit transforms people and families. The Holy Spirit’s role is to illuminate God’s Truth and to empower us to share the good news of Jesus Christ with others. God’s Word represents absolute truth, is without error, inspired by the Holy Spirit through men, and is our guide for daily living. It is the Holy Spirit that woos us through Prevenient Grace to accept Jesus Christ as Lord and Savior. In saying “yes” to Jesus we experience His Saving Grace. Our God exists as God the Father, Jesus the Son, and the Holy Spirit, all working on our behalf as Christ followers. God’s Sanctifying Grace is at work in each of us as we are being made more and more like Christ. As we embrace the Spirit-filled life, evidence is found in our display of the Fruit of the Spirit. God has sent His Holy Spirit as a rich deposit in each believer to guide us and teach us until the return of His Son, Jesus Christ.",
    references: "(John 14:26; Matthew 3:11; Matthew 28:19; John 15:26; Acts 1:8; Romans 14:16-18; Titus 3:4-6; 2 Peter 1:20-21; Galatians 5:22-23)",
    image: "/images/who-we-are/truth.png",
  },
] as const;

export const metadata = {
  title: "Who We Are",
  description: "Learn about Emmanuel Church in Abilene, our mission, core values, and beliefs.",
};

export default async function WhoWeArePage() {
  const doctrineHtml = await readFile(join(process.cwd(), "src/content/doctrine-statement.html"), "utf8");

  return (
    <>
      <section className="about-hero about-motion" aria-labelledby="about-title">
        <div className="about-hero__photo">
          <Image src={withBasePath(photos.hero.src)} alt={photos.hero.alt} fill priority sizes="100vw" style={{ objectPosition: photos.hero.position }} />
        </div>
        <div className="about-hero__copy">
          <p className="eyebrow">Who we are</p>
          <h1 id="about-title">
            <span>A Church</span>{" "}
            <span>Formed by</span>{" "}
            <span>the Gospel.</span>
          </h1>
          <p className="about-hero__intro">{site.mission}</p>
          <div className="about-hero__links">
            <Link className="button button--gold" href="/our-staff/">Meet the Staff</Link>
            <a className="about-text-link" href="#doctrine">Read Our Doctrine <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </section>

      <section className="about-mission" aria-labelledby="about-mission-title">
        <div className="about-container about-mission__grid">
          <div className="about-mission__copy about-motion">
            <p className="eyebrow">Our mission</p>
            <h2 id="about-mission-title">Love. Grace.<br /><em>Worship. Truth.</em></h2>
            <p>These four words shape how Emmanuel speaks about its life and ministry. They point us back to Jesus Christ and to the people and families we hope to serve.</p>
          </div>
          <figure className="about-mission__figure about-motion">
            <div className="about-mission__photo">
              <Image src={withBasePath(photos.fellowship.src)} alt={photos.fellowship.alt} fill sizes="(max-width: 760px) 100vw, 48vw" style={{ objectPosition: photos.fellowship.position }} />
            </div>
            <figcaption>Conversation · Emmanuel Church</figcaption>
          </figure>
        </div>
      </section>

      <section className="about-life" aria-labelledby="about-life-title">
        <div className="about-container">
          <div className="about-life__heading about-motion">
            <p className="eyebrow">Life together</p>
            <h2 id="about-life-title">We Gather, Learn, and Make Room for One Another.</h2>
            <p>A Sunday morning is more than a schedule. It is worship together, time in the Word, and space for every generation to belong.</p>
          </div>
          <figure className="about-life__feature about-motion">
            <div className="about-life__feature-photo">
              <Image src={withBasePath(photos.worship.src)} alt={photos.worship.alt} fill sizes="(max-width: 760px) 100vw, 67vw" style={{ objectPosition: photos.worship.position }} />
            </div>
            <figcaption><span className="eyebrow eyebrow--small">01 / Worship</span><strong>Voices raised together.</strong><p>Musicians lead the church in song on Sunday morning.</p></figcaption>
          </figure>
          <div className="about-life__pair">
            <figure className="about-motion">
              <div className="about-life__pair-photo"><Image src={withBasePath(photos.study.src)} alt={photos.study.alt} fill sizes="(max-width: 760px) 100vw, 50vw" style={{ objectPosition: photos.study.position }} /></div>
              <figcaption><span className="eyebrow eyebrow--small">02 / Learning</span><strong>Open Bibles, shared questions.</strong></figcaption>
            </figure>
            <figure className="about-motion">
              <div className="about-life__pair-photo"><Image src={withBasePath(photos.children.src)} alt={photos.children.alt} fill sizes="(max-width: 760px) 100vw, 50vw" style={{ objectPosition: photos.children.position }} /></div>
              <figcaption><span className="eyebrow eyebrow--small">03 / Children</span><strong>A place to learn and belong.</strong></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="about-values" aria-labelledby="about-values-title">
        <div className="about-container">
          <div className="about-values__heading about-motion">
            <p className="eyebrow">Core values</p>
            <h2 id="about-values-title">Four Words. A Life of Faith.</h2>
            <p>The artwork is familiar; the full language behind each value is available to read below.</p>
          </div>
          <div className="about-values__overview">
            {values.map((value, index) => (
              <article className="about-values__card about-motion" key={value.title}>
                <div className="about-values__art"><Image src={withBasePath(value.image)} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw" /></div>
                <div className="about-values__card-copy"><span className="about-values__number">0{index + 1}</span><h3>{value.title}</h3><p>{value.summary}</p></div>
              </article>
            ))}
          </div>
          <div className="about-values__reading about-motion" aria-label="Read the core values in full">
            <p className="eyebrow eyebrow--small">In full</p>
            {values.map((value) => (
              <details className="about-values__detail" key={value.title}>
                <summary><span>{value.title}</span><span className="about-values__read-label">Read the full value</span></summary>
                <div className="about-values__detail-copy"><h3>{value.backTitle}</h3><p>{value.backBody}</p><p className="about-values__references">{value.references}</p></div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="about-doctrine" id="doctrine" aria-labelledby="about-doctrine-title">
        <div className="about-container about-doctrine__layout">
          <div className="about-doctrine__intro about-motion">
            <p className="eyebrow">Doctrinal appendix</p>
            <h2 id="about-doctrine-title">What We Believe, in Full.</h2>
            <p>Read the complete Doctrines of Emmanuel Church, Inc. The statement is preserved in its original wording and references.</p>
          </div>
          <details className="doctrines-panel about-doctrine__panel about-motion">
            <summary><span>Open the full statement</span><span className="doctrines-panel__summary-hint">Long-form reading</span></summary>
            <div className="doctrines-panel__content"><DoctrineSearch html={doctrineHtml} /></div>
          </details>
        </div>
      </section>
    </>
  );
}
