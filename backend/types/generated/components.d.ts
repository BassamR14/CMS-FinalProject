import type { Schema, Struct } from '@strapi/strapi';

export interface BookRatingUserRatings extends Struct.ComponentSchema {
  collectionName: 'components_book_rating_user_ratings';
  info: {
    displayName: 'user_ratings';
  };
  attributes: {
    rating: Schema.Attribute.Decimal;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'book-rating.user-ratings': BookRatingUserRatings;
    }
  }
}
