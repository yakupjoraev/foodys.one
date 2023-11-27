import classNames from "classnames";
import useTranslation from "next-translate/useTranslation";
import React, { useId, useMemo, useState } from "react";
import { createHeroChatFormSchema } from "./validators";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export interface HeroChatProps {
  onSubmit: (
    formData: HeroChatFormData,
    cb: (success: boolean) => void
  ) => void;
}

export interface HeroChatFormData {
  name?: string;
  email: string;
  message: string;
}

interface HeroChatInnerFormData {
  name: string;
  email: string;
  message: string;
}

const DEFAULT_FORM_DATA: HeroChatInnerFormData = {
  name: "",
  email: "",
  message: "",
};

export function HeroChat(props: HeroChatProps) {
  const { t } = useTranslation("common");
  const [isChatActive, setChatActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const heroCharFormSchema = useMemo(() => createHeroChatFormSchema(t), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<HeroChatInnerFormData>({
    defaultValues: DEFAULT_FORM_DATA,
    resolver: zodResolver(heroCharFormSchema),
  });

  const toggleChat = () => {
    setChatActive(!isChatActive);
  };

  const closeChat = () => {
    setChatActive(false);
  };

  const handleHeroChatFormSubmit = handleSubmit((formData) => {
    const normalizedName = formData.name.trim();
    setLoading(true);
    props.onSubmit(
      {
        name: normalizedName.length ? normalizedName : undefined,
        email: formData.email,
        message: formData.message,
      },
      (success) => {
        setLoading(false);
        if (success) {
          reset(DEFAULT_FORM_DATA);
          setChatActive(false);
        }
      }
    );
  });

  return (
    <div>
      <div
        className={classNames("hero__chatbot", { active: isChatActive })}
        onClick={toggleChat}
      >
        <picture>
          {/* <source media="(max-width: 767px)" srcSet="/img/main-page/chatbot-mobile.png" /> */}
          <img src="/img/main-page/chat.svg" alt="chatbot" />
        </picture>
      </div>

      <div className={`hero__chat ${isChatActive ? "active" : ""}`}>
        <span className="hero__chat-close" onClick={closeChat}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="33"
            height="33"
            viewBox="0 0 33 33"
            fill="none"
          >
            <circle cx="16.5" cy="16.5" r="16.5" fill="#F0F0F0" />
            <path
              d="M22 11L16.5 16.5L11 11"
              stroke="#A8ADB8"
              stroke-width="2"
            />
            <path
              d="M11 22L16.5 16.5L22 22"
              stroke="#A8ADB8"
              stroke-width="2"
            />
          </svg>
        </span>
        <form
          className="modal-content__form"
          onSubmit={(ev) => void handleHeroChatFormSubmit(ev)}
        >
          <div className="modal-content__form-top">
            <h2 className="modal-content__title-main">{t("titleChat")}</h2>
          </div>

          <div className="modal-content__inputs">
            <div className="input__group">
              <label className="input__label" htmlFor={nameId}>
                {t("fieldNameName")}
              </label>
              <input
                className="input"
                id={nameId}
                type="text"
                placeholder={t("fieldNameName")}
                disabled={loading}
                {...register("name")}
              />
              {errors.name?.message && (
                <p className="input__error">{errors.name.message}</p>
              )}
            </div>

            <div className="input__group">
              <label className="input__label" htmlFor={emailId}>
                {t("fieldNameEmail")}*
              </label>
              <input
                className="input"
                id={emailId}
                type="email"
                placeholder={t("fieldNameEmail")}
                disabled={loading}
                {...register("email")}
              />
              {errors.email?.message && (
                <p className="input__error">{errors.email.message}</p>
              )}
            </div>

            <div className="input__group">
              <label className="input__label" htmlFor={messageId}>
                {t("fieldNameMessage")}*
              </label>
              <textarea
                className="input input__textarea"
                id={messageId}
                disabled={loading}
                {...register("message")}
              />
              {errors.message?.message && (
                <p className="input__error">{errors.message.message}</p>
              )}
            </div>

            <div className="input__border"></div>
          </div>

          <button
            type="submit"
            className="modal-content__btn"
            disabled={loading}
          >
            {t("buttonSend")}
          </button>
        </form>
      </div>
    </div>
  );
}
