import { ContextApi } from "@pancakeswap/localization";
import { FooterLinkType } from "../../../components/Footer/types";

export const footerLinks: (t: ContextApi["t"]) => FooterLinkType[] = (t) => [
  {
    label: t("Ecosystem"),
    items: [
      {
        label: t("Trade"),
        href: "/swap",
      },
      {
        label: t("Earn"),
        href: "/farms",
      },
      {
        label: t("Game"),
        href: "/prediction",
      },
      {
        label: t("NFT"),
        href: "/nfts",
      },
      {
        label: t("Tokenomics"),
        href: "https://docs.blockspot.tech/governance-and-tokenomics/cake-tokenomics",
      },
      {
        label: t("Litepaper"),
        href: "https://assets-flack.netlify.app/litepaper/v2litepaper.pdf",
      },
      {
        label: t("CAKE Emission Projection"),
        href: "https://analytics.flack.exchange/",
      },
      {
        label: t("Merchandise"),
        href: "https://merch.flack.exchange/",
      },
    ],
  },
  {
    label: "Business",
    items: [
      {
        label: t("Farms and Syrup Pools"),
        href: "https://docs.blockspot.tech/ecosystem-and-partnerships/business-partnerships/syrup-pools-and-farms",
      },
      {
        label: t("IFO"),
        href: "https://docs.blockspot.tech/ecosystem-and-partnerships/business-partnerships/initial-farm-offerings-ifos",
      },
      {
        label: t("NFT Marketplace"),
        href: "https://docs.blockspot.tech/ecosystem-and-partnerships/business-partnerships/nft-market-applications",
      },
    ],
  },
  {
    label: t("Developers"),
    items: [
      {
        label: t("Contributing"),
        href: "https://docs.blockspot.tech/developers/contributing",
      },
      {
        label: t("Github"),
        href: "https://github.com/pancakeswap",
      },
      {
        label: t("Bug Bounty"),
        href: "https://docs.blockspot.tech/developers/bug-bounty",
      },
    ],
  },
  {
    label: t("Support"),
    items: [
      {
        label: t("Contact"),
        href: "https://docs.blockspot.tech/contact-us/customer-support",
      },
      {
        label: t("Troubleshooting"),
        href: "https://docs.blockspot.tech/readme/help/troubleshooting",
      },
      {
        label: t("Documentation"),
        href: "https://docs.blockspot.tech/",
      },
    ],
  },
  {
    label: t("About"),
    items: [
      {
        label: t("Terms Of Service"),
        href: "https://hub.blockspot.tech/terms-of-service",
      },
      {
        label: t("Blog"),
        href: "https://blog.flack.exchange/",
      },
      {
        label: t("Brand Assets"),
        href: "https://docs.blockspot.tech/ecosystem-and-partnerships/brand",
      },
      {
        label: t("Careers"),
        href: "https://docs.blockspot.tech/team/become-a-chef",
      },
    ],
  },
];
