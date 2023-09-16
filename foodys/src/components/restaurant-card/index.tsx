import Link from "next/link";

export interface ListingCardProps {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviewsCount: number;
  address: string;
  tags?: string[];
}

export function RestaurantCard(props: ListingCardProps) {
  return (
    <div className="restaurant-card">
      <Link
        className="restaurant-card__photo-container"
        href={"/places/" + props.id}
      >
        <img
          className="restaurant-card__photo"
          src={props.photo}
          alt=""
          loading="lazy"
        />
      </Link>
      <div className="restaurant-card__details">
        <Link href={"/places/" + props.id} className="restaurant-card__title">
          {props.name}
        </Link>
        <div className="restaurant-card__row">
          <ul className="restaurant-card__tags restaurant-card__row-primary">
            {props.tags &&
              props.tags.map((tag) => {
                return (
                  <li className="restaurant-card__tag" key={tag}>
                    {tag}
                  </li>
                );
              })}
          </ul>
          <div className="restaurant-card__rating">
            &#9733; {props.rating.toFixed(1)} ({props.reviewsCount})
          </div>
        </div>
        <div className="restaurant-card__address">{props.address}</div>
      </div>
    </div>
  );
}
