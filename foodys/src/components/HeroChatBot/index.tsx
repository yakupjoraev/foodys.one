import React, { useState } from 'react';

export function HeroChatBot() {
  const [isChatActive, setChatActive] = useState(false);

  const toggleChat = () => {
    setChatActive(!isChatActive);
  };

  const closeChat = () => {
    setChatActive(false);
  };
  
    return (
      <div>
        <div className={`hero__chatbot ${isChatActive ? 'active' : ''}`} onClick={toggleChat}>
          <picture>
            {/* <source media="(max-width: 767px)" srcSet="/img/main-page/chatbot-mobile.png" /> */}
            <img src="/img/main-page/chat.svg" alt="chatbot" />
          </picture>
        </div>
  
        <div className={`hero__chat ${isChatActive ? 'active' : ''}`}>
          <span className="hero__chat-close" onClick={closeChat}>
            <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none">
              <circle cx="16.5" cy="16.5" r="16.5" fill="#F0F0F0" />
              <path d="M22 11L16.5 16.5L11 11" stroke="#A8ADB8" stroke-width="2" />
              <path d="M11 22L16.5 16.5L22 22" stroke="#A8ADB8" stroke-width="2" />
            </svg>
          </span>
          <form className="modal-content__form" action="#">
            <div className="modal-content__form-top">
              <h2 className="modal-content__title-main">
                Chat
              </h2>
            </div>

            <div className="modal-content__inputs">

              <div className="input__group">
                <label className="input__label" htmlFor="input20">
                  Name
                </label>

                <input className="input" type="text" placeholder="Name" id="input20" />
              </div>

              <div className="input__group">
                <label className="input__label" htmlFor="input21">
                  Email*
                </label>

                <input className="input" type="email" placeholder="Email*" id="input21" />
              </div>

              <div className="input__group">
                <label className="input__label" htmlFor="input22">
                  Message*
                </label>

                <textarea className="input input__textarea" id="input22"></textarea>
              </div>

              <div className="input__border"></div>
            </div>

            <button type="button" className="modal-content__btn">Send</button>
          </form>
        </div>
      </div>
    );
}
