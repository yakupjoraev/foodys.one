import { useId } from "react";

export interface DashboardFilterCheckboxProps {
  label: string | JSX.Element;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export function DashboardFilterCheckbox(props: DashboardFilterCheckboxProps) {
  const id = useId();

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const checked = ev.currentTarget.checked;
    props.onChange && props.onChange(checked);
  };

  return (
    <div className="filter-list___item">
      <input
        className="filter-list__input"
        id={id}
        type="checkbox"
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
