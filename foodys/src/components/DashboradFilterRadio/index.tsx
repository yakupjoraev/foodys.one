import { useId } from "react";

export interface DashboardFilterRadioProps<T extends string> {
  label: string | JSX.Element;
  name: string;
  form?: string;
  value: T;
  checked: boolean;
  onChange: (value: T) => void;
}

export function DashboardFilterRadio<T extends string>(
  props: DashboardFilterRadioProps<T>
) {
  const id = useId();

  const handleChange = (_ev: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(props.value);
  };

  return (
    <div className="filter-list___item">
      <input
        className="filter-list__input"
        id={id}
        name={props.name}
        form={props.form}
        type="radio"
        checked={props.checked}
        onChange={handleChange}
      />
      <label className="filter-list__label" htmlFor={id}>
        <div className="filter-list__decor" />
        {typeof props.label === "string" ? <p>{props.label}</p> : props.label}
      </label>
    </div>
  );
}
