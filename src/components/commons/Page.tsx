import { SEO } from '../../constants/seo';
import type { FCC } from '../../utils/types';

interface Props {
  title?: string;
  description?: string;
}

export const Page: FCC<Props> = ({
  children,
  title: partialTitle,
  description = SEO.DEFAULT_PAGE_DESCRIPTION,
}) => {
  const title = partialTitle ? `${partialTitle} • ${SEO.APPLICATION_NAME}` : SEO.APPLICATION_NAME;
  return (
    <>
      <title>{title}</title>

      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
      />

      <meta name="theme-color" content="#fffbeb" />
      <meta name="application-name" content={SEO.APPLICATION_NAME} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SEO.APPLICATION_NAME} />
      <meta name="twitter:card" content="summary_large_image" />

      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta name="twitter:description" content={description} />
      {children}
    </>
  );
};
