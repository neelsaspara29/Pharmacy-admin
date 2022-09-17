import inflection from "inflection";
// import generate from "nanoid/generate";

export const getNounNames = (name = "") => {
  return {
    name,
    singularName: inflection.singularize(name),
    pluralName: inflection.pluralize(name),
    titleizeName: inflection.titleize(name),
    humanizeName: inflection.humanize(inflection.underscore(name))
  };
};

export const isObjectEmpty = object => {
  return Object.keys(object).length === 0;
};

export const isArrayEmpty = array => {
  return array.length === 0;
};

// export const generateUUID = (length = 22, options = { numericOnly: false }) => {
//   let textPattern =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let numericOnlyPattern = "0123456789";

//   const pattern =
//     options && options.numericOnly ? numericOnlyPattern : textPattern;

//   let text = generate(pattern, length);
//   return text;
// };
