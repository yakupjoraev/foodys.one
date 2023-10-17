import classNames from "classnames";

export interface ServicePhoneProps {
  className?: string;
}

export function ServicePhone(props: ServicePhoneProps) {
  return (
    <a
      className={classNames("service-phone", props.className)}
      href="tel:0899186149"
    >
      <span className="service-phone__phone">0899 186 149</span>{" "}
      <span className="service-phone__price">
        Service €3 / appel
        <br /> + prix appel
      </span>
    </a>
  );
}
