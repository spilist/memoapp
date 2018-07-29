import getSlug from 'speakingurl-add-korean';

const slug = obj =>
  `${getSlug(obj.title, {
    truncate: 20,
    lang: 'ko',
  })}--${obj._id}`;

export default {
  slug,
};
