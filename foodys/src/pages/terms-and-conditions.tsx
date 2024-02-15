import { AboutSearch } from "~/components/AboutSearch";
import { Layout } from "~/components/Layout";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { HreflangMeta } from "~/components/HreflangMeta";

export default function TermsAndConditions() {
  const { t } = useTranslation("common");

  return (
    <Layout title={t("pageTitleTermsAndConditions")}>
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
                  <h1 className="about__title">
                    {t("titleTermsAndConditions")}
                  </h1>
                  <div className="about__descrs">
                    <p>
                      Please carefully review the Terms and Conditions, as your
                      use of your Account (&quot;Site&quot;) signifies your
                      acceptance of these Terms and Conditions. If you are
                      unwilling or unable to be bound by the Terms and
                      Conditions, please refrain from using the Site. These
                      Terms and Conditions are in addition to the standard Terms
                      of Use.
                    </p>
                    <h2>1. Definitions</h2>
                    <p>1.1 For the purposes of these Terms and Conditions:</p>
                    <ul>
                      <li>
                        &quot;User&quot; refers to anyone accessing, browsing,
                        crawling, or using the Site.
                      </li>
                      <li>
                        &quot;You&quot; and &quot;your&quot; pertain to you, the
                        user of the Site.
                      </li>
                      <li>
                        &quot;We,&quot; &quot;us,&quot; &quot;our,&quot; and
                        &quot;FOODYS.ONE&quot; denote Aragon Telecom Group (CY)
                        Ltd. and its affiliated companies.
                      </li>
                      <li>
                        &quot;Content&quot; encompasses text, images, photos,
                        audio, video, and any other data or communication.
                      </li>
                      <li>
                        &quot;Your Content&quot; pertains to content that you
                        submit or transmit to the Site, such as ratings,
                        reviews, compliments, invitations, and information
                        displayed in your account profile.
                      </li>
                      <li>
                        &quot;User Content&quot; denotes content submitted or
                        transmitted by users.
                      </li>
                      <li>
                        &quot;FOODYS.ONE Content&quot; includes content created
                        and provided by us on the Site.
                      </li>
                      <li>
                        &quot;Third Party Content&quot; covers content made
                        available on the Site by entities other than FOODYS.ONE
                        or its users.
                      </li>
                      <li>
                        &quot;Site Content&quot; encompasses all content
                        available on the Site, including Your Content, User
                        Content, Third Party Content, and FOODYS.ONE Content.
                      </li>
                    </ul>
                    <h2>2. Permitted Use</h2>
                    <p>
                      2.1 Your use of the Site constitutes your legal consent to
                      be bound by and comply with the following terms and
                      conditions. By using the Site, you affirm that you possess
                      the legal authority to execute, deliver, and fully perform
                      your obligations under this Agreement. FOODYS.ONE may
                      periodically amend and supplement these Terms and
                      Conditions, and the updated Terms and Conditions serve as
                      notice. It is your responsibility to regularly check for
                      revisions to these Terms and Conditions. All amended Terms
                      become effective upon posting on the Site, and any use of
                      the Site after such revisions signifies your consent and
                      agreement to the modified Terms and Conditions.
                    </p>
                    <p>
                      2.2 Some features of the Site may require registration and
                      the creation of an account (&quot;Account&quot;).
                    </p>
                    <p>
                      Information gathered during registration and related to
                      your Account is subject to these Terms and Conditions and
                      our Privacy Policy. You must provide accurate and complete
                      information during Account creation and maintain such
                      information. You also warrant that you are at least 18
                      years old. You are responsible for maintaining the
                      confidentiality of your account username and related
                      activities. FOODYS.ONE may, at its sole discretion,
                      terminate your account or take appropriate action in
                      response to violations of these Terms and Conditions. 2.3
                      Your authorized use of the Site is limited to personal
                      use, and you must not duplicate, download, publish,
                      modify, create derivative works, reproduce, distribute,
                      sell, trade, or exploit the Site&#39;s materials for any
                      purpose other than those described in these Terms and
                      Conditions.
                    </p>
                    <h2>3. User Content</h2>
                    <p>3.1 The Content you post should not:</p>
                    <ul>
                      <li>
                        Be offensive, harmful, or abusive, including expletives,
                        profanities, obscenities, harassment, vulgarities,
                        sexually explicit material, or content promoting
                        discrimination or bigotry.
                      </li>
                      <li>
                        Accuse others of illegal activity, describe physical
                        confrontations, or contain sexually explicit material.
                      </li>
                      <li>
                        Lack qualitative value, including spam, chain or mass
                        messaging.
                      </li>
                      <li>
                        Violate third-party rights, such as privacy, publicity,
                        copyright, trademark, patent, trade secret, or other
                        intellectual property rights.
                      </li>
                      <li>Be inappropriate given the subject matter.</li>
                      <li>
                        Contain personal information, email addresses, URLs,
                        phone numbers, or postal addresses.
                      </li>
                      <li>
                        Be commercial in nature, including spam, surveys,
                        contests, pyramid schemes, or other advertising
                        materials.
                      </li>
                      <li>
                        Violate the standards of good taste or the Site&#39;s
                        standards.
                      </li>
                      <li>
                        Be illegal or violate any local, state, or federal law.
                      </li>
                    </ul>
                    <p>
                      3.2 Any User Content submitted becomes the exclusive
                      property of FOODYS.ONE. FOODYS.ONE may store, reproduce,
                      adapt, modify, format, delete, translate, transmit, use,
                      disclose, sublicense, manipulate, prepare derivative
                      works, publish, display, distribute, and communicate any
                      User Content without obligation, notification, or
                      compensation to you. You acknowledge and agree that
                      FOODYS.ONE and its affiliates have the full right and
                      authority to use User Content for Site-related purposes,
                      including marketing and development.
                    </p>
                    <p>
                      3.3 FOODYS.ONE and its affiliates may modify, adapt, or
                      reformat your User Content as needed to conform to Site
                      standards, protocols, formats, and requirements. User
                      Content may be transmitted in various formats and mediums
                      over different networks.
                    </p>
                    <p>
                      3.4 FOODYS.ONE is not obligated to review User Content and
                      assumes no responsibility or liability concerning User
                      Content. You may not imply that any User Content is
                      sponsored or endorsed by FOODYS.ONE. FOODYS.ONE reserves
                      the right, at its sole discretion, to refuse or remove
                      User Content.
                    </p>
                    <h2>4. Site Availability</h2>
                    <p>
                      4.1 We may change, expand, improve, or discontinue
                      operating parts or all of the Site without prior notice.
                      Your use of the Site does not entitle you to the continued
                      availability of the Site.
                    </p>
                    <h2>5. Use of Site Content</h2>
                    <p>
                      5.1 You agree not to copy, reproduce, alter, modify,
                      create derivative works, distribute, display publicly, or
                      use the Site Content for unauthorized non-commercial
                      marketing and promotional campaigns, target or mass
                      solicitation campaigns, or political campaigning.
                    </p>
                    <p>
                      5.2 Data mining, scraping, crawling, or the use of
                      automated queries, or similar methods to extract data from
                      the Site, is prohibited.
                    </p>
                    <p>
                      5.3 You may not compile data for use by a competitive
                      listing product or service or interfere with the proper
                      functioning of the Site.
                    </p>
                    <p>
                      5.4 You may not modify the visual display of the Site or
                      its Content, obscure advertisements, or link to the Site
                      without express authorization.
                    </p>
                    <h2>6. Termination</h2>
                    <p>
                      6.1 You are not obligated to use the Site and may cease
                      using it at any time.
                    </p>
                    <p>
                      6.2 FOODYS.ONE may, at its sole discretion, suspend or
                      terminate your access to the Site, edit or delete
                      materials you provide, access, preserve, or disclose your
                      materials, or take other remedial actions in response to
                      violations of this Agreement.
                    </p>
                    <h2>7. Indemnification</h2>
                    <p>
                      7.1 You agree to indemnify and hold FOODYS.ONE and its
                      affiliates, as well as their officers, directors,
                      employees, agents, and representatives, harmless from any
                      claim or demand arising from your use of the Site or
                      violations of these Terms and Conditions.
                    </p>
                    <h2>8. Warranty Disclaimer and Limitation of Liability</h2>
                    <p>
                      8.1 Your use of the Site and the Internet is at your sole
                      risk. FOODYS.ONE disclaims responsibility for the
                      accuracy, content, completeness, legality, reliability,
                      and operability of information and Site Content accessible
                      through the Site.
                    </p>
                    <p>
                      8.2 The Site and Site Content are provided &quot;as
                      is&quot; and &quot;as available,&quot; without warranties
                      of any kind, whether express or implied. FOODYS.ONE does
                      not warrant security, reliability, timeliness, accuracy,
                      or performance of the Site.
                    </p>
                    <p>
                      8.3 FOODYS.ONE shall not be liable for any damages related
                      to your use of the Site, reliance on Site Content, or any
                      use of the Internet, including direct, special, punitive,
                      indirect, consequential, or incidental damages, whether
                      based on warranty, contract, intellectual property
                      infringement, tort, or other theories, even if FOODYS.ONE
                      is aware of the possibility of such damage.
                    </p>
                    <p>
                      8.4 You assume responsibility and risk for using the Site
                      and the Internet.
                    </p>
                    <p>
                      8.5 FOODYS.ONE might use third party content which is
                      replicated as it is and it is outside our ability to
                      modify or edit.
                    </p>
                    <h2>9. Miscellaneous</h2>
                    <p>
                      9.1 The Site may contain links to Third Party Sites. We do
                      not control or endorse Third Party Sites and are not
                      responsible for their content or availability. Content and
                      information provided to a Third Party Site may be shared
                      and used on our Site as per our Privacy Policy.
                    </p>
                    <p>
                      9.2 In case of a dispute concerning the Site, the rules of
                      the Republic of Cyprus will govern such disputes. The
                      Courts of Nicosia are competent to settle any dispute.
                    </p>
                    <p>
                      <i>December 2023</i>
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
