import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



const Page = ({ session }: {session : string}) => {
  return <pre>{JSON.stringify(session)}</pre>;
};

export default Page;
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: { session },
  };
}