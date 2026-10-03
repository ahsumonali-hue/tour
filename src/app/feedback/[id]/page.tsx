import FeedbackPage from "../page";

export function generateStaticParams() {
  return [
    { id: "t-sajek-oct" },
    { id: "t-sylhet-oct" },
    { id: "t-cox-nov" },
    { id: "t-bandarban-nov" },
    { id: "t-sundarban-dec" },
    { id: "t-puthia-day" },
  ];
}

export default function DynamicFeedbackPage() {
  return <FeedbackPage />;
}
