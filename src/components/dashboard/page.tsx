import config from "@/config/env";
import Stats from "./_components/stats";
import Summary from "./_components/summary/summary";
import Layout from "./layout";

export default function Dashboard() {
  const company_id = config.COMPANY_ID;

  return (
    <Layout>
      <Stats company_id={company_id} />
      <Summary company_id={company_id} />
    </Layout>
  );
}
