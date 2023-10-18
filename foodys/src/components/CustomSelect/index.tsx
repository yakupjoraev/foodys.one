import Select, { CSSObjectWithLabel, GroupBase, Props } from "react-select";

export function CustomSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Omit<Props<Option, IsMulti, Group>, "styles" | "components">) {
  return (
    <Select
      {...props}
      styles={{
        control: (baseStyles, _state) => {
          const nextStyle = {
            ...baseStyles,
            minHeight: 46,
            borderRadius: 5,
            backgroundColor: "#F5F5F5",
            fontFamily: "var(--secondary-font)",
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "112.8%",
            color: "var(--text-color)",
          };

          return nextStyle;
        },
        placeholder: (baseStyle, _state) => {
          const nextStyle: CSSObjectWithLabel = {
            ...baseStyle,
            color: "#979aa0",
          };
          return nextStyle;
        },
        option: (baseStyle, state) => {
          const nextStyle: CSSObjectWithLabel = {
            ...baseStyle,
            fontFamily: "var(--secondary-font)",
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "112.8%",
            padding: 10,
          };

          if (state.isSelected) {
            nextStyle.backgroundColor = "var(--primary-color)";
            nextStyle.color = "var(--white-color)";
          } else if (state.isFocused) {
            nextStyle.backgroundColor = "#e6e7e9";
          } else {
            nextStyle.backgroundColor = "#f5f5f5";
            nextStyle.color = "var(--text-color)";
          }

          if (!state.isDisabled) {
            nextStyle.cursor = "pointer";
          }

          return nextStyle;
        },
        menuList: (baseStyle, _state) => {
          const nextStyle: CSSObjectWithLabel = {
            ...baseStyle,
            borderRadius: 5,
            padding: 0,
            "::-webkit-scrollbar": {
              width: "2px",
              height: 0,
            },
            "::-webkit-scrollbar-track": {
              background: "#fff",
            },
            "::-webkit-scrollbar-thumb": {
              borderRadius: "5px",
              background: "var(--primary-color)",
            },
            scrollbarColor: "var(--primary-color) #fff",
            scrollbarWidth: "thin",
          };
          return nextStyle;
        },
      }}
      components={{
        IndicatorSeparator: () => null,
        DropdownIndicator: () => {
          return (
            <svg
              style={{ width: 15, height: "auto", marginRight: "13px" }}
              width="11"
              height="7"
              viewBox="0 0 11 7"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.35298 1.29296C0.540282 1.10586 0.794283 1.00076 1.05913 1.00076C1.32397 1.00076 1.57797 1.10586 1.76527 1.29296L5.0543 4.57934L8.34333 1.29296C8.43547 1.19764 8.54568 1.12161 8.66754 1.06931C8.78939 1.017 8.92045 0.98947 9.05307 0.988319C9.18569 0.987167 9.31721 1.01242 9.43996 1.0626C9.56271 1.11278 9.67423 1.18688 9.76801 1.28059C9.86178 1.37429 9.93595 1.48572 9.98617 1.60837C10.0364 1.73102 10.0617 1.86243 10.0605 1.99494C10.0594 2.12746 10.0318 2.25841 9.97946 2.38017C9.92711 2.50193 9.85102 2.61205 9.75563 2.70412L5.76045 6.69608C5.57315 6.88318 5.31915 6.98828 5.0543 6.98828C4.78946 6.98828 4.53546 6.88318 4.34816 6.69608L0.35298 2.70412C0.165735 2.51697 0.0605469 2.26317 0.0605469 1.99854C0.0605469 1.7339 0.165735 1.48011 0.35298 1.29296Z"
                fill="#313743"
                fill-opacity="0.5"
              />
            </svg>
          );
        },
      }}
    />
  );
}
