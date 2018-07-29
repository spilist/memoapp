import getSlug from 'speakingurl-add-korean';

const slug = obj => {
  if (!obj._id) {
    return 'all';
  }

  return `${getSlug(obj.title, {
    truncate: 20,
    lang: 'ko',
  })}--${obj._id}`;
};

const truncate = (text, number = 20) => {
  if (text.length <= number) {
    return text;
  } else {
    return `${text.substring(0, number)}...`;
  }
};

const getId = slug => {
  const isIdExist = slug.indexOf('--') !== -1;
  return isIdExist ? slug.split('--').pop() : null;
};

export default {
  slug,
  getId,
  truncate,
};
