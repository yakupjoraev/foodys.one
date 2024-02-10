import { AboutSearch } from "~/components/AboutSearch";
import { Layout } from "~/components/Layout";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { HreflangMeta } from "~/components/HreflangMeta";

export default function Cookies() {
  const { t } = useTranslation("common");

  return (
    <Layout title={t("pageTitleCookies")}>
      <Head>
        <meta name="robots" content="index, follow" />
      </Head>
      <HreflangMeta />
      <main className="main">
        <section className="about">
          <div className="container">
            <div className="about__inner">
              <div className="about__info">
                <div className="about__info-main">
                  <h1 className="about__title">{t("titleCookies")}</h1>
                  <div className="about__descrs">
                    <p>
                      Aragon Telecom Group (CY) Ltd. (referred to as
                      &quot;we,&quot; &quot;us,&quot; or &quot;FOODYS.ONE&quot;)
                      has formulated this cookie statement (referred to as the
                      &quot;Statement&quot;) to uphold your privacy rights.
                      Aragon Telecom Group (CY) Ltd. is an organization
                      established under the laws of Cyprus, with its primary
                      location at Minoos Str. 24, Strovolos, 2042 Nicosia,
                      Cyprus.
                    </p>
                    <p>
                      Upon your initial visit to a FOODYS.ONE Website, you will
                      receive information regarding our utilization of cookies
                      and tracking pixels designed to enhance your website
                      experience. To leverage the full functionality of our
                      sites, it is necessary to consent to the use of cookies.
                    </p>
                    <p>
                      FOODYS.ONE deploys cookies and similar technologies to
                      monitor your interaction with FOODYS.ONE Websites. These
                      technologies empower us to provide crucial features and
                      functionalities, track your activities, offer a
                      personalized experience, and present information,
                      including targeted advertisements, that align with your
                      preferences.
                    </p>
                    <p>
                      This Statement adheres to Cyprus&#39;s legal privacy
                      requirements and reaffirms our unwavering commitment to
                      safeguarding your personal information.
                    </p>
                    <h2>1. What Are Cookies?</h2>
                    <p>
                      A cookie or tracking pixel is a small data file downloaded
                      onto your computer, mobile phone, or tablet when you
                      access a website. It enables the website to recognize your
                      device and store data about your preferences and past
                      actions. Cookies can only contain information you provide
                      and cannot access data from your hard disk or cookies from
                      other websites. FOODYS.ONE does not correlate this
                      information with individual users, nor does it share or
                      sell this data to third parties.
                    </p>
                    <h2>2. What Is a Tracking Pixel?</h2>
                    <p>
                      A tracking pixel, also known as a marketing pixel, is a
                      small code containing a graphic placed on a webpage to
                      monitor user behavior, site conversions, web traffic, and
                      primarily, to target or remarket ads. To facilitate ad
                      targeting or remarketing, information is gathered on an
                      anonymous cookie, which is then used to display targeted
                      ads to specific individuals on FOODYS.ONE Websites. For
                      example, if you visited our website looking for plumbers,
                      tracking pixels enable you to receive a special offer ad
                      from a plumber when visiting Facebook, Twitter, or another
                      site later.
                    </p>
                    <h2>3. Cookies Used on This Website</h2>
                    <p>
                      FOODYS.ONE Websites employ four categories of cookies:
                    </p>
                    <ul>
                      <li>
                        Essential Cookies: Essential for proper website
                        functioning, enabling navigation and feature usage.
                        Without these cookies, some website sections may not
                        work correctly.
                      </li>
                      <li>
                        Functional Cookies: Enhance user experience by retaining
                        preferences and choices on our website, providing
                        personalized features and improved functionality.
                      </li>
                      <li>
                        Marketing/Advertising Cookies: Deliver relevant ads and
                        gauge the effectiveness of our marketing/advertising
                        efforts. These cookies help display targeted ads and
                        measure campaign performance.
                      </li>
                      <li>
                        Analytics Cookies: Collect data on how visitors use our
                        website. They track which pages visitors view and how
                        long they stay, aiding in website performance
                        improvement and content optimization.
                      </li>
                    </ul>
                    <p>
                      Some of the cookies and tracking pixels may be placed on
                      your device by third parties when using our website, such
                      as the Facebook Pixel or Google Analytics. FOODYS.ONE
                      lacks control over these or how the respective third
                      parties utilize them. These third parties provide services
                      to us, such as analytics or personalized advertising based
                      on your FOODYS.ONE Website searches.
                    </p>
                    <h2>4. How We Use Cookies</h2>
                    <p>We use cookies for various purposes, including:</p>
                    <ul>
                      <li>
                        Authentication and Security: Assisting in user
                        authentication and preventing fraudulent activities.
                      </li>
                      <li>
                        Personalization: Remembering your preferences (e.g.,
                        language or color) and providing personalized content
                        and recommendations.
                      </li>
                      <li>
                        Advertising/Marketing: Displaying relevant ads based on
                        your interests and browsing behavior.
                      </li>
                      <li>
                        Analytics: Gathering insights into how users interact
                        with our website to enhance its functionality and
                        content.
                      </li>
                      <li>
                        Visitor Profiling: Creating profiles of website
                        visitors, identifying location and interests. We strive
                        to minimize and anonymize this data to prioritize your
                        privacy.
                      </li>
                    </ul>
                    <p>
                      We also place ads on third-party websites. Cookies control
                      the frequency of particular ads shown on these websites to
                      prevent excessive exposure to the same FOODYS.ONE-sourced
                      ad. These cookies are not used for data collection.
                    </p>
                    <p>
                      Additionally, we may use service providers to serve
                      third-party advertisements on FOODYS.ONE Websites or
                      FOODYS.ONE ads on other sites. These providers may set
                      cookies on your computer browser, collecting anonymous
                      information about your visits to other websites or
                      FOODYS.ONE Websites. This information includes browser
                      type, IP address, domain name, and the web page from which
                      you accessed those websites, among others. Third parties
                      utilize this information to optimize online advertising
                      campaigns.
                    </p>
                    <p>
                      Please note that if you choose not to accept
                      advertising/marketing cookies on FOODYS.ONE Websites, this
                      may limit our ability to serve you ads that align with
                      your preferences.
                    </p>
                    <p>
                      Periodically, we analyze website traffic and usage to
                      assess which features and services are favored and
                      disliked. This data helps us enhance our offerings and
                      prepare aggregated user statistics to describe our
                      services to third parties like prospective business
                      partners and advertisers.
                    </p>
                    <h2>5. Managing Your Consent to Cookies</h2>
                    <p>
                      On your initial visit to a FOODYS.ONE Website, you will
                      receive information about our use of cookies and tracking
                      pixels. To fully enjoy the website&#39;s functionality,
                      you must consent to using cookies.
                    </p>
                    <p>
                      If you later change your mind and decide not to allow
                      cookies when visiting our sites, you can manage and
                      control cookies in your browser settings. Most browsers
                      offer options to refuse or delete cookies, and you can
                      clear your cache using the browser&#39;s &quot;help&quot;
                      function.
                    </p>
                    <p>
                      To reject some or all third-party cookies, visit the
                      relevant party&#39;s website directly to manage the
                      cookies stored on your device by them.
                    </p>
                    <p>
                      Please be aware that disabling cookies may impact the
                      functionality of some site features. For additional
                      information on managing cookies, consult your browser’s
                      help documentation. To withdraw consent you&#39;ve
                      previously provided, please contact us at info [at)
                      foodys.one
                    </p>
                    <h2>6. Duration of Consent</h2>
                    <p>
                      Once you consent to using cookies, your consent remains
                      valid for 12 months. This means that if individual cookies
                      expire within that 12-month period, we do not need to seek
                      your permission again to place new cookies on your device.
                      If you opt not to accept cookies on your device when
                      visiting our website, we may request your permission again
                      on each subsequent visit.
                    </p>
                    <h2>7. Changes to This Cookie Statement</h2>
                    <p>
                      Your use of FOODYS.ONE Websites, along with any disputes
                      arising from it, is governed by this Statement, our
                      Privacy Statement, and our Terms of Use, including its
                      choice of law provisions. We retain the right to modify
                      and update the Statement as necessary and in a timely
                      manner. We encourage you to periodically review our
                      Statement to stay informed about any changes.
                    </p>
                    <h2>8. Contact Us</h2>
                    <p>
                      If you have concerns about our Statement, the security of
                      your personal information, or our compliance with
                      applicable personal information protection legislation,
                      please provide a brief explanation of your concern to our
                      Privacy Officer:
                    </p>
                    <p>
                      <i>info [at) foodys.one</i>
                    </p>
                    <p>
                      <i>Amended: December 2023</i>
                    </p>
                  </div>
                </div>
              </div>
              <AboutSearch />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
