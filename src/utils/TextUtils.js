import getSlug from 'speakingurl-add-korean';

const slug = obj =>
  `${getSlug(obj.title, {
    truncate: 20,
    lang: 'ko',
  })}--${obj._id}`;

const getId = slug => {
  const isIdExist = slug.indexOf('--') !== -1;
  return isIdExist ? slug.split('--').pop() : null;
};

export default {
  slug,
  getId,
};
