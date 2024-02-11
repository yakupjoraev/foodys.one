import type {
  InferGetServerSidePropsType,
  GetServerSideProps,
  GetServerSidePropsContext,
  PreviewData,
} from "next";
import type { ParsedUrlQuery } from "node:querystring";

export const getServerSideProps = ((ctx) => {
  const destination = getDestination(ctx);

  return Promise.resolve({ redirect: { destination, permanent: true } });
}) satisfies GetServerSideProps<Record<string, string>>;

export default function Redirect404(
  _props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return null;
}

function getDestination(
  ctx: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) {
  const locale = ctx.locale;
  const defaultLocale = ctx.defaultLocale;

  if (locale === undefined || defaultLocale === undefined) {
    return "/404";
  }

  if (locale === defaultLocale) {
    return "/404";
  }

  return "/" + locale + "/404";
}
