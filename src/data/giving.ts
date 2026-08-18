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
        text: "Every good gift and every perfect gift is from above, and cometh down from the Father of lights, with whom is no variableness, neither shadow of turning.",
      },
      {
        reference: "1 Chronicles 29:14",
        text: "But who am I, and what is my people, that we should be able to offer so willingly after this sort? for all things come of thee, and of thine own have we given thee.",
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
        text: "Honour the LORD with thy substance, and with the firstfruits of all thine increase:",
      },
      {
        reference: "Romans 12:1",
        text: "I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service.",
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
        text: "And this they did, not as we hoped, but first gave their own selves to the Lord, and unto us by the will of God.",
      },
      {
        reference: "2 Corinthians 8:7",
        text: "Therefore, as ye abound in every thing, in faith, and utterance, and knowledge, and in all diligence, and in your love to us, see that ye abound in this grace also.",
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
        text: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.",
      },
      {
        reference: "2 Corinthians 9:11",
        text: "Being enriched in every thing to all bountifulness, which causeth through us thanksgiving to God.",
      },
    ],
  },
];
