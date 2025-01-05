import { ReactElement } from "react";
import Layout from "./layout";



const Page = ({}) => {
  return <div>Dashboard</div>;
};

export default Page;
Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};