export type SpiritualGiftResource = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  image: string;
  actionLabel: string;
};

export const spiritualGiftResources: SpiritualGiftResource[] = [
  {
    eyebrow: "Start here",
    title: "Spiritual Gifts Inventory",
    description:
      "Take the inventory, reflect on the ways God has shaped you, and send your results to Pastor Marc Riegel or bring them by the church office.",
    href: "https://s3.amazonaws.com/media.cloversites.com/e2/e2ead5b7-45a8-43f4-adde-d65f8939cc7b/documents/Spiritual_Gifts_Inventory.pdf",
    image: "/images/spiritual-gifts-inventory.jpg",
    actionLabel: "Download inventory",
  },
  {
    eyebrow: "Next step",
    title: "SERVE Booklet",
    description:
      "Explore Emmanuel's ministries and discover how your spiritual gifts can complement the people and places where the church is serving.",
    href: "https://s3.amazonaws.com/media.cloversites.com/e2/e2ead5b7-45a8-43f4-adde-d65f8939cc7b/documents/SERVE_Booklet.2025.pdf",
    image: "/images/serve-booklet.png",
    actionLabel: "Open Serve booklet",
  },
];

export const spiritualGiftTeaching = [
  "After taking the Spiritual Gifts Inventory, the Serve Booklet is your next step. It is a practical list of Emmanuel's ministries and the ways your gifts can strengthen them.",
  "If you opened your Bible and compared the words volunteer and servant, you would quickly find servant used far more often. Scripture calls each of us to take on the nature of a servant as Christ did.",
  "At Emmanuel Church, we believe spiritual gifts are for today. They empower us to build up the Body of Believers, and serving is one of the clearest ways to put those gifts into action.",
];
