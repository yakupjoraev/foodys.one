import classNames from "classnames";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

export default function Main() {
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 991.98) {
        setMobileExpanded(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={classNames("main__body main-page-body", {
        locked: mobileExpanded,
      })}
    >
      <Head>
        <title>Foodys</title>
        <link rel="stylesheet" href="/css/style.css" />
      </Head>
      <Header
        mobileMenuExpanded={mobileExpanded}
        onToggleMobileMenu={() => setMobileExpanded(!mobileExpanded)}
      />
      <main className="main">
        <section className="hero">
          <div className="container">
            <div className="hero__inner">
              <div className="hero__info">
                <h1 className="hero__title">
                  <span>#Burgers!</span>
                  Junk food can
                  <br />
                  be so tasty
                </h1>
                <div className="hero__picture">
                  <img
                    src="/img/main-page/main-page-pic-1.png"
                    alt="#Burgers! "
                  />
                </div>
                <form className="hero__form" action="#">
                  <p className="hero__form-label">
                    Find a restaurant or a delivery:
                  </p>
                  <div className="hero__form-search">
                    <input
                      className="hero__form-search-input"
                      type="search"
                      placeholder="City, cuisine or restaurant name"
                    />
                    <img
                      className="hero__form-search-icon"
                      src="/img/icons/glass.svg"
                      alt="glass"
                    />
                  </div>
                  <button type="button" className="hero__form-search-btn">
                    Search
                  </button>
                </form>
              </div>
              <div className="hero__pictures">
                <div className="hero__uk">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={139}
                    height={139}
                    viewBox="0 0 139 139"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_841_68518)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M69.1408 1.48042C70.3298 2.51539 70.9773 3.84485 71.0822 5.46847C71.1873 7.0924 70.7165 8.49398 69.6706 9.67335C68.6244 10.8529 67.3 11.4945 65.6973 11.5981C64.0945 11.7018 62.6984 11.2361 61.6362 10.2013C60.3199 9.16632 59.6729 7.83702 59.5678 6.21324C59.4628 4.52383 59.9333 3.18773 60.9794 2.00837C62.0253 0.828855 63.3498 0.187268 64.9527 0.0836153C66.5554 -0.0200377 67.9513 0.445615 69.1408 1.48042ZM65.1123 2.55105C64.2434 2.61033 63.4476 2.966 62.8702 3.61725C62.3415 4.17039 62.0358 5.07953 62.0985 6.04951C62.1611 7.01982 62.5208 7.79059 63.1771 8.36212C63.8336 8.93397 64.6203 9.1614 65.5377 9.13066C66.4551 9.07138 67.2168 8.70176 67.7798 8.06447C68.357 7.41321 68.6143 6.60251 68.5515 5.6322C68.4889 4.66221 68.1293 3.89129 67.4729 3.23686C66.8164 2.74806 66.0295 2.49179 65.1123 2.55105ZM57.3394 4.96287C57.4933 5.98564 57.3556 6.94929 56.8149 7.85335C56.3599 8.75772 55.5215 9.2993 54.4239 9.61946L52.8129 10.0371L53.688 13.4124L51.2332 14.0489L48.4489 3.30929L52.5147 2.25516C53.5679 1.98207 54.5507 2.10949 55.4625 2.63711C56.3743 3.11641 56.963 3.94011 57.3394 4.96287ZM53.1112 4.55649L51.5003 4.97412L52.2164 7.73575L53.8272 7.3181C54.3153 7.22 54.4832 7.00635 54.6597 6.67668C54.8363 6.34717 54.8742 5.98802 54.7734 5.59923C54.6726 5.2106 54.4649 4.91533 54.1505 4.71277C53.8362 4.51053 53.4896 4.45854 53.1112 4.55649ZM46.8886 7.81466C47.3176 8.78038 47.3396 9.75354 46.9545 10.734C46.5692 11.5864 45.8793 12.4259 44.8849 12.8678L43.3641 13.5438L44.7803 16.7302L42.4629 17.7601L37.9571 7.62163L41.7952 5.91575C42.7896 5.47386 43.7798 5.43867 44.7658 5.80955C45.7518 6.10245 46.4595 6.84927 46.8886 7.81466ZM42.7607 8.08824L41.24 8.76422L42.3986 11.3711L43.9193 10.6953C44.2766 10.5367 44.5154 10.2804 44.6356 9.92615C44.7557 9.57207 44.7343 9.21181 44.5712 8.84472C44.4081 8.47781 44.155 8.22043 43.8115 7.96953C43.4682 7.83005 43.1906 7.92958 42.7607 8.08824ZM39.2428 18.6814C38.9575 19.6991 38.2967 20.5545 37.3992 21.2481C36.2246 21.9416 35.1818 22.2268 34.1326 22.1025C33.0832 21.9786 32.2352 21.4337 31.5886 20.4678L27.4092 14.2248L29.5166 12.8141L33.5725 18.8725C34.1486 19.7332 34.9193 19.8402 35.8852 19.1935C36.8511 18.5468 37.046 17.7935 36.4699 16.9329L32.414 10.8744L34.5214 9.46365L38.7007 15.7064C39.3474 16.6725 39.5279 17.6642 39.2428 18.6814ZM25.5834 20.5084C25.0868 20.3404 24.6864 20.2085 24.3229 20.3264C23.9593 20.3733 23.6011 20.564 23.2489 20.8987C22.9731 21.1609 22.817 21.4222 22.7804 21.6828C22.7441 21.9435 22.8059 22.1581 22.9658 22.3266C23.1552 22.5259 23.4126 22.6091 23.7386 22.5761C24.0647 22.5434 24.6061 22.215 25.409 21.9504C25.7797 21.7443 26.105 21.5883 26.3394 21.482C26.574 21.3761 26.8943 21.2645 27.3008 21.1477C27.7075 21.0312 28.0876 20.9842 28.347 21.0062C28.638 21.0287 28.9609 21.1154 29.3158 21.2664C29.6708 21.4177 30.0047 21.6578 30.3176 21.987C31.0456 22.753 31.3431 23.6182 31.2101 24.5826C31.1957 25.5472 30.5663 26.4516 29.6779 27.2959C28.9752 28.0748 28.0053 28.5464 27.1193 28.7105C26.2332 28.8748 25.3843 28.7599 24.6292 28.3139L25.2841 25.9395C26.3362 26.3768 27.2279 26.2132 28.0321 25.449C28.7598 24.7576 28.9162 24.1934 28.5013 23.7569C28.2757 23.5196 27.9823 23.3293 27.6213 23.5326C27.2602 23.6209 26.6744 23.8824 25.8636 24.3175C25.4391 24.5459 25.0889 24.6955 24.6842 24.848C24.3222 24.9733 23.9315 25.0569 23.5118 25.0984C23.0923 25.1401 22.6847 25.0792 22.2889 24.9158C21.8933 24.7527 21.5207 24.4871 21.1713 24.1195C20.4654 23.3767 20.1673 22.5301 20.2774 21.5798C20.3876 20.6299 20.8103 19.7425 21.5457 19.1065C22.2043 18.4806 22.9338 18.0824 23.7342 17.9122C24.5344 17.6536 25.3789 17.8136 26.212 18.1267L25.5834 20.5084ZM13.3609 33.0911L14.8919 34.1091L17.086 30.8097L19.0921 32.1436L16.898 35.4432L18.5345 36.5314L20.9918 32.8361L23.0243 34.1876L19.1627 39.9947L9.92423 33.8513L13.7419 28.1103L15.7744 29.4617L13.3609 33.0911ZM15.9553 46.4619L9.30278 45.7415L14.6296 49.8236L13.5714 52.5071L2.12819 51.283L3.10483 48.7075L11.0332 49.8707L4.59326 45.0312L5.34912 43.1145L13.3588 43.9729L6.83755 39.3398L7.81435 36.8628L17.0134 43.7783L15.9553 46.4619ZM124.691 50.3276L135.415 47.4858L135.902 49.3243L131.176 55.0035L136.998 53.4609L137.648 55.9122L126.923 58.754L126.436 56.9156L131.162 51.2362L125.34 52.7475L124.691 50.3276ZM136.448 66.8076L136.045 62.5376L134.214 62.7075L134.58 66.6529L132.182 66.7886L131.815 62.9301L129.858 63.1118L130.269 67.5308L127.838 67.7563L127.194 60.8125L138.241 59.7867L138.878 66.6518L136.448 66.8076ZM7.79343 62.0759C8.21978 62.5766 8.43898 63.1479 8.34452 63.7897C8.28365 64.4525 7.99773 64.9968 7.48643 65.4219C6.99826 65.8473 6.38821 66.0294 5.72539 65.9687C5.19776 65.9097 4.55522 65.6252 4.14044 65.1148C3.72566 64.6048 3.54862 63.8897 3.60948 63.3552C3.66939 62.703 3.94644 62.1713 4.47027 61.7603C4.93434 61.3495 5.50746 61.1224 6.15966 61.2336C6.89682 61.2945 7.36739 61.5752 7.79343 62.0759ZM0.865778 79.9587L0.154294 73.1009L2.58212 72.8491L3.03177 77.1573L4.86064 76.9947L4.58438 72.9366L6.84801 72.8049L7.25677 76.7462L9.21164 76.452L8.75375 72.1292L11.1816 71.8773L12.0352 78.8139L0.865778 79.9587ZM8.03878 88.3993L13.8433 86.8299L14.52 89.2739L3.82726 92.1335L3.31991 90.4003L7.98299 84.6695L2.17843 86.2761L1.50198 83.7221L12.1945 80.8726L12.7019 82.7056L8.03878 88.3993ZM16.3918 93.4921L6.2359 97.8434L5.19142 95.5107L15.3972 91.1594L16.3918 93.4921ZM18.0945 96.9565L16.8555 98.3633L18.9629 101.833L20.7447 101.49L22.1631 103.873L10.6998 106.305L9.1633 103.526L16.7489 94.5172L18.0945 96.9565ZM12.4014 103.433L16.5308 102.467L15.2015 100.233L12.4014 103.433ZM22.4659 104.176L24.2964 106.234L22.8731 110.204L23.663 111.114L26.4153 108.684L28.0781 110.638L19.7018 117.846L16.7917 114.563C16.0989 113.765 15.7893 112.803 15.9881 111.801C15.9361 110.757 16.3716 109.889 17.1694 109.134C17.6799 108.753 18.2756 108.484 18.9562 108.39C19.6371 108.295 20.4022 108.376 20.9392 108.63L22.4659 104.176ZM18.8321 111.111C18.5291 111.374 18.3554 111.69 18.3105 112.057C18.2661 112.425 18.3581 112.74 18.5866 112.971L19.8338 114.44L21.9878 112.569L20.7406 111.133C20.5119 110.87 20.2126 110.734 19.8422 110.727C19.4721 110.72 19.1355 110.848 18.8321 111.111ZM31.0603 113.213L30.5603 119.536L33.8096 115.559L35.7732 117.164L28.753 125.755L26.8307 124.151L29.8382 120.42L24.1629 122.005L21.9293 120.179L28.2455 118.361L28.8267 111.488L31.0603 113.213ZM38.0731 119.603C39.1092 119.395 40.1716 119.595 41.2601 120.202C42.349 120.81 43.0766 121.609 43.4429 122.601C43.8095 123.592 43.7095 124.594 43.1429 125.609L39.4815 132.03L37.2671 130.934L40.8204 124.478C41.3252 123.663 41.0701 122.928 40.0551 122.361C39.0402 121.795 38.2804 121.964 37.7757 122.868L34.2223 129.234L32.008 127.998L35.7508 121.438C36.2361 120.423 37.0373 119.715 38.0731 119.603ZM52.5752 125.265L55.0176 125.947L52.6898 134.282L55.4375 135.05L54.781 137.265L46.8429 135.065L47.4996 132.833L50.2943 133.496L52.5752 125.265ZM58.3481 136.901C57.7689 136.08 57.4355 135.145 57.5575 134.096C57.6358 133.424 57.8946 132.824 58.4092 132.296C58.7728 131.767 59.3152 131.272 59.9604 131.137L58.0858 126.818L60.7936 127.133L62.4873 130.996L63.6467 131.135L64.0681 127.514L66.5871 127.807L65.3497 138.698L60.896 138.314C59.8466 138.192 58.9973 137.615 58.3481 136.901ZM63.3901 133.339L61.5522 133.119C61.1545 133.079 60.8423 133.18 60.5637 133.425C60.2855 133.669 60.1229 133.99 60.1463 134.257C60.03 134.788 60.1145 135.138 60.3291 135.44C60.544 135.741 60.8245 135.912 61.171 135.953L63.0601 136.173L63.3901 133.339ZM68.6138 133.546C68.4913 131.923 68.9682 130.517 69.9798 129.272C71.0888 128.135 72.3306 127.48 73.9321 127.359C75.5337 127.238 76.9346 127.688 78.1349 128.71C79.3355 129.732 79.9969 131.054 80.1194 132.677C80.2421 134.299 79.7867 135.706 78.7533 136.897C77.7203 138.087 76.4856 138.743 74.8013 138.864C73.1997 138.85 71.94 138.535 70.5983 137.513C69.398 136.491 68.7363 135.168 68.6138 133.546ZM74.6149 136.399C75.5316 136.33 76.2749 135.966 76.8452 135.308C77.4155 134.651 77.6854 133.837 77.5908 132.868C77.6474 131.898 77.1495 131.131 76.487 130.567C75.8245 130.002 75.0349 129.755 74.1183 129.824C73.2016 129.893 72.4582 130.257 71.888 130.89C71.3177 131.572 71.0692 132.385 71.1426 133.355C71.2158 134.324 71.5837 135.091 72.2462 135.656C72.9258 136.22 73.6983 136.468 74.6149 136.399ZM82.4742 133.901C82.1977 132.881 82.3249 131.916 82.8553 131.006C83.3861 130.096 84.1767 129.498 85.2269 129.214L86.8332 128.778L85.9211 125.413L88.3687 124.75L91.2709 135.458L87.2171 136.557C86.1668 136.841 85.1828 136.725 84.2652 136.207C83.3476 135.689 82.7504 134.921 82.4742 133.901ZM86.5952 134.262L88.2014 133.827L87.4552 131.05L85.8488 131.509C85.4716 131.611 85.1963 131.827 85.0235 132.159C84.8506 132.386 84.8167 132.85 84.9218 133.238C85.0267 133.625 85.2375 133.826 85.5542 134.117C85.8709 134.316 86.218 134.364 86.5952 134.262ZM92.7763 130.938C92.3367 129.977 92.304 128.901 92.6785 128.019C93.0531 127.035 93.7352 126.27 94.7247 125.863L96.238 125.171L94.8615 122L97.0933 120.945L101.709 131.033L97.89 132.781C96.9004 133.234 95.9106 133.147 94.9206 132.92C93.9306 132.559 93.2158 131.898 92.7763 130.938ZM96.9008 130.619L98.4141 129.927L97.2272 127.332L95.7139 128.025C95.3585 128.187 95.1224 128.446 95.0062 128.802C94.8898 129.157 94.9152 129.517 95.0823 129.883C95.2493 130.248 95.5053 130.502 95.8502 130.647C96.1951 130.791 96.5455 130.782 96.9008 130.619ZM100.308 119.986C100.582 118.965 101.233 118.103 102.261 117.398C103.29 116.693 104.329 116.397 105.38 116.51C106.431 116.622 107.285 117.158 108.01 118.116L112.189 124.313L110.097 125.747L105.975 119.733C105.39 118.879 104.729 118.78 103.699 119.437C102.7 120.094 102.514 120.85 103.099 121.704L107.221 127.718L105.129 129.152L100.882 122.955C100.225 121.996 100.033 121.006 100.308 119.986ZM114.006 118.01C114.558 118.173 114.846 118.154 115.209 118.179C115.572 118.128 115.928 117.933 116.277 117.515C116.55 117.33 116.703 117.067 116.736 116.756C116.77 116.544 116.706 116.285 116.544 116.044C116.353 115.967 116.094 115.886 115.769 115.923C115.443 115.959 114.904 116.139 114.151 116.566C113.737 116.777 113.413 116.936 113.32 117.045C112.947 117.153 112.627 117.268 112.301 117.39C111.817 117.511 111.469 117.561 111.178 117.543C110.886 117.523 110.563 117.394 110.206 117.293C109.971 117.146 109.513 116.909 109.197 116.583C108.46 115.825 108.153 114.963 108.276 113.997C108.398 113.031 109.028 112.122 109.779 111.268C110.59 110.48 111.438 109.999 112.322 109.718C113.206 109.651 114.056 109.757 114.872 110.04L114.187 112.576C113.154 112.15 112.24 112.324 111.444 113.097C110.724 113.762 110.574 114.362 110.994 114.794C111.222 115.029 111.516 115.1 111.876 115.008C112.236 114.916 112.819 114.648 113.625 114.205C114.047 113.972 114.489 113.708 114.799 113.661C115.159 113.532 115.612 113.444 115.968 113.398C116.387 113.352 116.796 113.408 117.193 113.567C117.59 113.726 117.966 113.988 118.319 114.352C119.073 115.087 119.34 115.93 119.241 116.881C119.141 117.832 118.862 118.662 117.999 119.368C117.347 120.001 116.622 120.407 115.824 120.586C115.025 120.689 114.199 120.702 113.344 120.399L114.006 118.01ZM126.032 105.295L124.49 104.294L122.332 107.507L120.441 106.305L122.469 102.982L120.821 101.817L118.487 105.634L116.357 104.304L120.155 98.4555L129.46 104.498L125.705 110.28L123.658 108.951L126.032 105.295ZM123.291 91.9556L130.05 92.6021L124.608 88.5797L125.608 85.8846L137.064 86.9835L136.114 89.4711L128.175 88.4932L134.667 93.2618L133.98 95.1867L125.914 94.4161L132.486 98.9774L131.536 101.465L122.262 94.6507L123.291 91.9556ZM131.121 77.5939C130.7 77.0887 130.523 76.5152 130.589 75.8743C130.657 75.2121 130.949 74.671 131.464 74.2514C131.98 73.8316 132.569 73.6558 133.231 73.7238C133.872 73.7896 134.398 74.0798 134.807 74.5946C135.216 75.1091 135.387 75.6975 135.319 76.3599C135.252 77.0115 134.969 77.5401 134.471 77.9458C133.972 78.3511 133.397 78.5207 132.746 78.4395C132.084 78.3858 131.542 78.0992 131.121 77.5939ZM122.866 46.0912L133.119 41.8525L134.106 44.1961L123.835 48.4347L122.866 46.0912ZM121.223 42.5648L122.453 41.2099L120.384 37.6459L118.598 38.0414L117.205 35.6426L128.695 33.3355L130.318 36.0833L122.616 44.9638L121.223 42.5648ZM126.998 36.1897L122.822 37.1104L124.127 39.3585L126.998 36.1897ZM116.907 35.2766L115.142 33.2605L116.565 29.3058L115.785 28.3878L113.117 30.7326L111.365 28.8159L119.82 21.6318L122.693 25.0136C123.377 25.8187 123.677 26.7428 123.592 27.7853C123.508 28.8278 123.063 29.6914 122.258 30.3755C121.742 30.8134 121.144 31.0757 120.523 31.1629C119.78 31.2499 119.12 31.1624 118.482 30.8451L116.907 35.2766ZM120.633 28.4429C120.922 28.183 121.183 27.8693 121.147 27.5023C121.196 27.1352 121.107 26.8188 120.882 26.553L119.65 25.1038L117.476 26.951L118.708 28.4005C118.933 28.6661 119.231 28.8046 119.601 28.816C119.971 28.8273 120.424 28.703 120.633 28.4429ZM108.433 26.1089L108.98 19.8917L105.687 23.8328L103.741 22.207L110.854 13.6923L112.8 15.3181L109.711 18.9817L115.403 17.4927L117.748 19.342L111.281 21.0918L110.626 27.9583L108.433 26.1089ZM101.471 19.7452C100.433 19.9422 99.3729 19.7308 98.291 19.1112C97.2089 18.4917 96.49 17.6845 96.1347 16.6893C95.779 15.6942 96.0312 14.6926 96.4677 13.6837L100.201 7.16436L102.534 8.42456L98.7785 14.7514C98.2639 15.6502 98.511 16.388 99.5196 16.9657C100.528 17.5431 101.403 17.3828 101.804 16.484L105.427 10.1572L107.727 11.4174L103.895 17.9368C103.317 18.9456 102.509 19.5482 101.471 19.7452ZM87.029 13.9232L84.5942 13.2143L87.0604 4.83133L84.2742 3.98812L84.9936 1.76445L92.8697 4.06832L92.1872 6.41183L89.4481 5.61428L87.029 13.9232ZM81.3805 2.22439C82.0207 3.05159 82.2741 3.98941 82.1405 5.03737C82.0551 5.70828 81.8554 6.30565 81.345 6.82931C80.9 7.3533 80.3535 7.73352 79.7057 7.97062L81.5335 12.3097L78.8292 11.9652L77.2147 8.08459L76.0198 7.93228L75.559 11.5485L73.0434 11.228L74.4457 0.222302L78.8479 0.696194C80.0359 0.916821 80.7402 1.39721 81.3805 2.22439ZM76.3003 5.73126L78.1869 5.97154C78.5329 5.94712 78.8462 5.91732 79.1274 5.67595C79.4368 5.43487 79.6697 5.11534 79.625 4.71688C79.6758 4.31858 79.5951 3.96753 79.3837 3.66352C79.1721 3.35969 78.8934 3.18567 78.5474 3.1416L76.6609 2.90117L76.3003 5.73126Z"
                        fill="white"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_841_68518">
                        <rect
                          width={139}
                          height={139}
                          fill="white"
                          transform="translate(0 139) rotate(-90)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <img
                    className="hero__uk-pic"
                    src="/img/main-page/flag-uk.png"
                    alt=""
                  />
                </div>
                <a className="hero__chatbot" href="#">
                  <picture>
                    <source
                      media="(max-width: 767px)"
                      srcSet="/img/main-page/chatbot-mobile.png"
                    />
                    <img src="/img/main-page/chatbot.png" alt="chatbot" />
                  </picture>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
