import { Translate } from "next-translate";
import useTranslation from "next-translate/useTranslation";
import { useMemo } from "react";
import { CustomSelect } from "~/components/CustomSelect";
import { Layout } from "~/components/Layout";

interface EstablismentOption {
  value: "restaurant" | "coffeeAndTea" | "bar";
  label: string;
}

interface CousineOption {
  value: "italian" | "spanish" | "french" | "georgian" | "chinese" | "japanese";
  label: string;
}

interface PriceOption {
  value: "1" | "2" | "3" | "4";
  label: string;
}

interface ServiceOption {
  value: "delivery" | "dine_in" | "takeout" | "curbside_pickup";
  label: string;
}

export default function New() {
  const { t } = useTranslation("common");

  const establismentOptions: EstablismentOption[] = useMemo(
    () => createEstablishmentOptions(t),
    [t]
  );

  const cousineOptions: CousineOption[] = useMemo(
    () => createCousineOptions(t),
    [t]
  );

  const priceOptions: PriceOption[] = useMemo(() => createPriceOptions(), []);

  const serviceOptions: ServiceOption[] = useMemo(
    () => createServiceOptions(t),
    [t]
  );

  return (
    <Layout title="Foodys - New bussines">
      <main className="main">
        <section className="create-page">
          <div className="container">
            <form action="#" className="create-page__inner">
              <div className="input__border" />
              <div className="create-page__header">
                <h1 className="create-page__title">Edit information</h1>
                <button type="button" className="create-page__close">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={28}
                    height={28}
                    viewBox="0 0 28 28"
                    fill="none"
                  >
                    <circle cx={14} cy={14} r={14} fill="#F0F0F0" />
                    <path
                      d="M18.668 9.33285L14.0013 13.9995L9.33464 9.33285"
                      stroke="#A8ADB8"
                      strokeWidth={2}
                    />
                    <path
                      d="M9.33398 18.6662L14.0007 13.9995L18.6673 18.6662"
                      stroke="#A8ADB8"
                      strokeWidth={2}
                    />
                  </svg>
                </button>
              </div>
              <div className="create-page__content">
                <div className="create-page__overview">
                  <div className="create-page__label">
                    Overview
                    <div className="input__border" />
                  </div>
                  <div className="create-page__overview-column">
                    <div className="input__group">
                      <label className="input__label" htmlFor="overview1">
                        Business local name
                      </label>
                      <input
                        className="input"
                        type="text"
                        placeholder="Business local name"
                        id="overview1"
                      />
                      <button type="button" className="input__chanched">
                        <img src="/img/icons/pen.svg" alt="pen" />
                      </button>
                    </div>
                    <div className="input__group">
                      <label className="input__label" htmlFor="overview2">
                        Address
                      </label>
                      <input
                        className="input"
                        type="text"
                        placeholder="Address"
                        id="overview2"
                      />
                      <button type="button" className="input__chanched">
                        <img src="/img/icons/pen.svg" alt="pen" />
                      </button>
                    </div>
                    <div className="input__group">
                      <label className="input__label" htmlFor="overview3">
                        Postal code
                      </label>
                      <input
                        className="input"
                        type="text"
                        placeholder="Postal code"
                        id="overview3"
                      />
                      <button type="button" className="input__chanched">
                        <img src="/img/icons/pen.svg" alt="pen" />
                      </button>
                    </div>
                    <div className="input__group">
                      <label className="input__label" htmlFor="overview4">
                        City
                      </label>
                      <input
                        className="input"
                        type="text"
                        placeholder="City"
                        id="overview4"
                      />
                      <button type="button" className="input__chanched">
                        <img src="/img/icons/pen.svg" alt="pen" />
                      </button>
                    </div>
                    <div className="input__group">
                      <label className="input__label" htmlFor="overview5">
                        Country
                      </label>
                      <input
                        className="input"
                        type="text"
                        placeholder="Country"
                        id="overview5"
                      />
                      <button type="button" className="input__chanched">
                        <img src="/img/icons/pen.svg" alt="pen" />
                      </button>
                    </div>
                    <div className="input__group">
                      <label className="input__label" htmlFor="overview6">
                        Phone number
                      </label>
                      <input
                        className="input"
                        type="text"
                        placeholder="Phone number"
                        id="overview6"
                      />
                      <button type="button" className="input__chanched">
                        <img src="/img/icons/pen.svg" alt="pen" />
                      </button>
                    </div>
                    <div className="input__group">
                      <label className="input__label" htmlFor="overview7">
                        Website
                      </label>
                      <input
                        className="input"
                        type="text"
                        placeholder="Website"
                        id="overview7"
                      />
                      <button type="button" className="input__chanched">
                        <img src="/img/icons/pen.svg" alt="pen" />
                      </button>
                    </div>
                  </div>
                  <div className="create-page__overview-column">
                    <div className="input__group">
                      <label className="input__label" htmlFor="overview9">
                        Establishment type
                      </label>
                      <CustomSelect options={establismentOptions} />
                    </div>
                    <div className="input__group">
                      <label className="input__label" htmlFor="overview9">
                        Cuisine
                      </label>
                      <CustomSelect options={cousineOptions} />
                    </div>
                    <div className="input__group">
                      <label className="input__label" htmlFor="overview9">
                        Price
                      </label>
                      <CustomSelect options={priceOptions} />
                    </div>
                    <div className="input__group">
                      <label className="input__label" htmlFor="overview9">
                        Services
                      </label>
                      <CustomSelect options={serviceOptions} isMulti={true} />
                    </div>
                    <div className="create-page__label create-page__label--not-margin">
                      Opening hours
                      <div className="input__border" />
                    </div>
                    <div className="input__group">
                      <label className="input__label" htmlFor="overview8">
                        Days
                      </label>
                      <input
                        className="input"
                        type="text"
                        placeholder="Days"
                        id="overview8"
                      />
                      <button type="button" className="input__chanched">
                        <img src="/img/icons/pen.svg" alt="pen" />
                      </button>
                    </div>
                    <div className="input__group">
                      <label className="input__label" htmlFor="overview9">
                        Hours
                      </label>
                      <input
                        className="input"
                        type="text"
                        placeholder="Hours"
                        id="overview9"
                      />
                      <button type="button" className="input__chanched">
                        <img src="/img/icons/pen.svg" alt="pen" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="create-page__photos">
                  <div className="create-page__label">
                    Photos
                    <div className="input__border" />
                  </div>
                  <div className="drag-drop">
                    <div className="drag-drop__top">
                      <input
                        className="drag-drop__input"
                        type="file"
                        id="file1"
                      />
                      <label className="drag-drop__label" htmlFor="file1">
                        <img src="/img/modal/grag-drop.svg" alt="" />
                        <p className="drag-drop__label-text">
                          Drag&amp;drop your photos here
                        </p>
                      </label>
                    </div>
                    <div className="drag-drop__files">
                      <div className="drag-drop__file">
                        <img
                          className="drag-drop__file-pic"
                          src="/img/dashboard/slide-1.jpg"
                          alt=""
                        />
                        <button
                          type="button"
                          className="drag-drop__file-delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={15}
                            height={15}
                            viewBox="0 0 15 15"
                            fill="none"
                          >
                            <circle cx="7.5" cy="7.5" r="7.5" fill="#F0F0F0" />
                            <path
                              d="M10 5L7.5 7.5L5 5"
                              stroke="#A8ADB8"
                              strokeWidth={2}
                            />
                            <path
                              d="M5 10L7.5 7.5L10 10"
                              stroke="#A8ADB8"
                              strokeWidth={2}
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="drag-drop__file">
                        <img
                          className="drag-drop__file-pic"
                          src="/img/dashboard/slide-2.jpg"
                          alt=""
                        />
                        <button
                          type="button"
                          className="drag-drop__file-delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={15}
                            height={15}
                            viewBox="0 0 15 15"
                            fill="none"
                          >
                            <circle cx="7.5" cy="7.5" r="7.5" fill="#F0F0F0" />
                            <path
                              d="M10 5L7.5 7.5L5 5"
                              stroke="#A8ADB8"
                              strokeWidth={2}
                            />
                            <path
                              d="M5 10L7.5 7.5L10 10"
                              stroke="#A8ADB8"
                              strokeWidth={2}
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="drag-drop__file">
                        <img
                          className="drag-drop__file-pic"
                          src="/img/dashboard/slide-3.jpg"
                          alt=""
                        />
                        <button
                          type="button"
                          className="drag-drop__file-delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={15}
                            height={15}
                            viewBox="0 0 15 15"
                            fill="none"
                          >
                            <circle cx="7.5" cy="7.5" r="7.5" fill="#F0F0F0" />
                            <path
                              d="M10 5L7.5 7.5L5 5"
                              stroke="#A8ADB8"
                              strokeWidth={2}
                            />
                            <path
                              d="M5 10L7.5 7.5L10 10"
                              stroke="#A8ADB8"
                              strokeWidth={2}
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="drag-drop__file">
                        <img
                          className="drag-drop__file-pic"
                          src="/img/dashboard/slide-4.jpg"
                          alt=""
                        />
                        <button
                          type="button"
                          className="drag-drop__file-delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={15}
                            height={15}
                            viewBox="0 0 15 15"
                            fill="none"
                          >
                            <circle cx="7.5" cy="7.5" r="7.5" fill="#F0F0F0" />
                            <path
                              d="M10 5L7.5 7.5L5 5"
                              stroke="#A8ADB8"
                              strokeWidth={2}
                            />
                            <path
                              d="M5 10L7.5 7.5L10 10"
                              stroke="#A8ADB8"
                              strokeWidth={2}
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="input__border" />
                    <div className="modal-content__btns modal-content__btns--third">
                      <button
                        type="button"
                        className="modal-content__btn modal-content__btn-outline"
                      >
                        Cancel
                      </button>
                      <button type="button" className="modal-content__btn">
                        Save
                      </button>
                      <button
                        type="button"
                        className="modal-content__btn modal-content__btn-preview"
                      >
                        <img src="/img/icons/eye.svg" alt="preview img" />
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    </Layout>
  );
}

function createEstablishmentOptions(t: Translate): EstablismentOption[] {
  const options: EstablismentOption[] = [
    {
      value: "restaurant",
      label: t("valueEstablishmentTypeRestaurant"),
    },
    {
      value: "coffeeAndTea",
      label: t("valueEstablishmentTypeCoffeeTea"),
    },
    {
      value: "bar",
      label: t("valueEstablishmentTypeBar"),
    },
  ];
  return options;
}

function createCousineOptions(t: Translate): CousineOption[] {
  const options: CousineOption[] = [
    {
      value: "italian",
      label: t("valueCuisineItalian"),
    },
    {
      value: "spanish",
      label: t("valueCuisineSpanish"),
    },
    {
      value: "french",
      label: t("valueCuisineFrench"),
    },
    {
      value: "georgian",
      label: t("valueCuisineGeorgian"),
    },
    {
      value: "chinese",
      label: t("valueCuisineChinese"),
    },
    {
      value: "japanese",
      label: t("valueCuisineJapanese"),
    },
  ];
  return options;
}

function createPriceOptions(): PriceOption[] {
  const options: PriceOption[] = [
    {
      value: "1",
      label: "€",
    },
    {
      value: "2",
      label: "€€",
    },
    {
      value: "3",
      label: "€€€",
    },

    {
      value: "4",
      label: "€€€€",
    },
  ];

  return options;
}

function createServiceOptions(t: Translate): ServiceOption[] {
  const options: ServiceOption[] = [
    {
      value: "delivery",
      label: t("valueServiceDelivery"),
    },
    {
      value: "dine_in",
      label: t("valueServiceDineIn"),
    },
    {
      value: "takeout",
      label: t("valueServiceTakeOut"),
    },
    {
      value: "curbside_pickup",
      label: t("valueServicePickUp"),
    },
  ];

  return options;
}
