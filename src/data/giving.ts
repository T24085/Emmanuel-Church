export type GivingScripture = {
  reference: string;
  text: string;
};

export type GivingPrinciple = {
  id: string;
  title: string;
  lens: string;
  summary: string;
  scriptures: GivingScripture[];
};

export type GivingJourneyStage = {
  id: string;
  title: string;
  subtitle: string;
  quote: string;
  body: string;
  scripture: string;
  scriptureText: string;
  question: string;
};

export const givingJourneyStages: GivingJourneyStage[] = [
  {
    id: "awakened",
    title: "Awakened",
    subtitle: "Uplifted to receive",
    quote: "I'm beginning to give.",
    body:
      "An Awakened Giver recognizes that generosity is part of following Jesus and takes the first step in giving. They respond to God's Word by choosing to give and beginning to trust God with what He has entrusted to them.",
    scripture: "Philippians 1:4–6",
    scriptureText:
      "In all my prayers for all of you, I always pray with joy because of your partnership in the gospel from the first day until now, being confident of this, that he who began a good work in you will carry it on to completion until the day of Christ Jesus.",
    question:
      "God, do I trust You as my Provider? What is one step I can take to begin giving and show that I trust You with what You have entrusted to me?",
  },
  {
    id: "rooted",
    title: "Rooted",
    subtitle: "Uplifted to respond",
    quote: "Giving becomes a rhythm.",
    body:
      "A Rooted Giver makes generosity a regular part of life. Consistent giving develops the discipline of giving and helps us learn to trust God rather than simply giving when it is convenient.",
    scripture: "Proverbs 3:9–10",
    scriptureText:
      "Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing, and your vats will brim over with new wine.",
    question:
      "God, has generosity become a regular rhythm in my life? What would it look like for me to become more consistent and disciplined in giving?",
  },
  {
    id: "intentional",
    title: "Intentional",
    subtitle: "Uplifted to be transformed",
    quote: "I'm choosing generosity.",
    body:
      "An Intentional Giver begins to make generosity a priority. They look honestly at their spending, saving, and giving and ask, ‘Does the way I use my resources reflect what I say I value?’ This is often where a person begins intentionally pursuing the biblical practice of tithing.",
    scripture: "2 Corinthians 8:5, 7",
    scriptureText:
      "And they exceeded our expectations: They gave themselves first of all to the Lord, and then by the will of God also to us. But since you excel in everything—in faith, in speech, in knowledge, in complete earnestness and in the love we have kindled in you—see that you also excel in this grace of giving.",
    question:
      "God, does the way I spend, save, and give reflect what I say I value? What needs to change so that my resources increasingly reflect that You come first?",
  },
  {
    id: "surrendered",
    title: "Surrendered",
    subtitle: "Uplifted to trust",
    quote: "God has access to everything.",
    body:
      "A Surrendered Giver recognizes that Jesus has given everything for us, so everything we have belongs to Him. They surrender not just a portion of their resources but their whole financial life to God. Giving begins to shape how they spend, save, and live.",
    scripture: "1 Chronicles 29:14",
    scriptureText:
      "But who am I, and who are my people, that we should be able to give as generously as this? Everything comes from you, and we have given you only what comes from your hand.",
    question:
      "God, is there any part of my financial life that I am still holding back from You? What would it look like to trust You with everything You have entrusted to me?",
  },
  {
    id: "kingdom-minded",
    title: "Kingdom-Minded",
    subtitle: "Uplifted to invest",
    quote: "I'm investing in what lasts, the Kingdom.",
    body:
      "A Kingdom-Minded Giver looks beyond month-to-month giving and considers how today's financial decisions can increase tomorrow's generosity. They think about their home, car, lifestyle, savings, and spending in light of their ability to participate in God's Kingdom work. They live with an eternal perspective, asking, ‘How can what God has entrusted to me create a lasting difference?’",
    scripture: "2 Corinthians 9:11",
    scriptureText:
      "You will be enriched in every way so that you can be generous on every occasion, and through us your generosity will result in thanksgiving to God.",
    question:
      "God, am I making financial decisions with eternity in mind? How can I use what You have entrusted to me to create a lasting Kingdom impact?",
  },
];

export const givingPrinciples: GivingPrinciple[] = [
  {
    id: "everything-comes-from-god",
    title: "Everything Comes From God.",
    lens: "Ownership",
    summary:
      "Everything we have—our time, talents, treasure, relationships, and opportunities—is a gift from God. Because He is the true owner of all things, we faithfully steward what He has entrusted to us.",
    scriptures: [
      {
        reference: "James 1:17",
        text: "Every good and perfect gift is from above, coming down from the Father of the heavenly lights, who does not change like shifting shadows.",
      },
      {
        reference: "1 Chronicles 29:14",
        text: "But who am I, and who are my people, that we should be able to give as generously as this? Everything comes from you, and we have given you only what comes from your hand.",
      },
    ],
  },
  {
    id: "giving-is-worship",
    title: "Giving Is Worship.",
    lens: "Response",
    summary:
      "Giving is more than a financial transaction; it is an act of worship. When we give, we honor God, declare that He comes first, and express our trust in His provision.",
    scriptures: [
      {
        reference: "Proverbs 3:9",
        text: "Honor the Lord with your wealth, with the firstfruits of all your crops;",
      },
      {
        reference: "Romans 12:1",
        text: "Therefore, I urge you, brothers and sisters, in view of God’s mercy, to offer your bodies as a living sacrifice, holy and pleasing to God—this is your true and proper worship.",
      },
    ],
  },
  {
    id: "generosity-transforms-us",
    title: "Generosity Transforms Us.",
    lens: "Formation",
    summary:
      "Generosity is a spiritual practice that shapes our hearts. As we faithfully give, God grows our faith, loosens our grip on earthly possessions, and forms us into people who reflect His generous character.",
    scriptures: [
      {
        reference: "2 Corinthians 8:5",
        text: "And they exceeded our expectations: They gave themselves first of all to the Lord, and then by the will of God also to us.",
      },
      {
        reference: "2 Corinthians 8:7",
        text: "But since you excel in everything—in faith, in speech, in knowledge, in complete earnestness and in the love we have kindled in you—see that you also excel in this grace of giving.",
      },
    ],
  },
  {
    id: "the-kingdom-grows",
    title: "The Kingdom Grows.",
    lens: "Mission",
    summary:
      "God uses our faithfulness to accomplish far more than we can see. Through our generosity, the Gospel advances, the church is strengthened, lives are changed, and God receives the glory.",
    scriptures: [
      {
        reference: "Matthew 6:33",
        text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.",
      },
      {
        reference: "2 Corinthians 9:11",
        text: "You will be enriched in every way so that you can be generous on every occasion, and through us your generosity will result in thanksgiving to God.",
      },
    ],
  },
];
