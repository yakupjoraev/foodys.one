import { useId, useState } from "react";
import { Layout } from "~/components/Layout";
import { ReviewForm, ReviewFormSubmitData } from "~/components/ReviewForm";
import { ReviewRatingInput } from "~/components/ReviewRatingInput";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { db } from "~/server/db";
import {
  createPlacePreviewByPhotoReference,
  createPlaceResourceByGoogleId,
} from "~/server/api/utils/g-place";
import Link from "next/link";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import useTranslation from "next-translate/useTranslation";

export const getServerSideProps = (async (ctx) => {
  const country = ctx.params?.country;
  const city = ctx.params?.city;
  const slug = ctx.params?.slug;
  if (
    typeof country !== "string" ||
    typeof city !== "string" ||
    typeof slug !== "string"
  ) {
    return {
      notFound: true,
    };
  }

  const placeUrl = await db.placeUrl.findFirst({
    where: {
      url: "/" + country + "/" + city + "/" + slug,
    },
  });
  if (placeUrl === null) {
    return {
      notFound: true,
    };
  }
  const placeId = placeUrl.g_place_id;
  if (placeId === null) {
    return {
      notFound: true,
    };
  }

  const place = await createPlaceResourceByGoogleId(placeId);
  if (place === null) {
    return {
      notFound: true,
    };
  }

  let preview: { src: string; srcSet?: string } | undefined = undefined;
  const firstPhoto = place.photos ? place.photos[0] : undefined;
  if (firstPhoto) {
    preview = createPlacePreviewByPhotoReference(firstPhoto.photo_reference);
  }
  const absolutePlaceUrl = new URL(placeUrl.url, env.NEXT_PUBLIC_SITE_URL);

  return {
    props: {
      placeId: place.id,
      name: place.name,
      address: place.formatted_address,
      url: absolutePlaceUrl.toString(),
      preview: preview ?? { src: "/img/dashboard/empty168x168.svg" },
    },
  };
}) satisfies GetServerSideProps<{
  placeId: string;
  url: string;
  name?: string;
  address?: string;
  preview: { src: string; srcSet?: string };
}>;

export default function Review(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [reviewFormLoading, setReviewFormLoading] = useState(false);
  const createReview = api.reviews.createGPlaceReview.useMutation();

  const handleReviewFormSubmit = (formData: ReviewFormSubmitData) => {
    setReviewFormLoading(true);
    createReview
      .mutateAsync({
        placeId: props.placeId,
        rating: formData.rating,
        review: formData.review,
      })
      .then(() => {
        toast.success("Review created.");
        void router.replace(props.url + "#reviews");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to create review!");
      })
      .finally(() => {
        setReviewFormLoading(false);
      });
  };

  return (
    <Layout title="Foodys - Write a review">
      <main className="main">
        <section className="review-page">
          <div className="container">
            <div className="review-page__inner">
              <div className="review-page__restaurant">
                <h1 className="review-page__title">{t("titleCreateReview")}</h1>
                <div className="review-page__restaurant-card">
                  <Link
                    className="review-page__restaurant-image-link"
                    href={props.url}
                  >
                    <img
                      className="review-page__restaurant-image"
                      src={props.preview.src}
                      srcSet={props.preview.srcSet}
                      alt=""
                      width="168"
                      height="168"
                    />
                  </Link>
                  {props.name && (
                    <div className="review-page__restaurant-name">
                      <Link
                        className="review-page__restaurant-name-link"
                        href={props.url}
                      >
                        {props.name}
                      </Link>
                    </div>
                  )}
                  {props.address && (
                    <Link
                      className="review-page__restaurant-address"
                      href={props.url + "#location"}
                    >
                      {props.address}
                    </Link>
                  )}
                </div>
              </div>
              <ReviewForm
                loading={reviewFormLoading}
                onSubmit={handleReviewFormSubmit}
              />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
