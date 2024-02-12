/* eslint-disable no-unused-vars */
/* eslint-disable node/no-unsupported-features/es-syntax */
const filter = (dbQuery, reqQuery) => {
  let apiQuery = { ...reqQuery };

  const deleteItems = ['limit', 'page', 'sort', 'fields'];

  deleteItems.forEach((ele) => delete apiQuery[ele]);

  const apiQueryString = JSON.stringify(apiQuery);

  if (apiQueryString.includes('gt')) {
    apiQuery = JSON.parse(apiQueryString.replace('gt', '$gt'));
    // console.log(apiQuery);
  } else if (apiQueryString.includes('gte')) {
    apiQuery = JSON.parse(apiQueryString.replace('gte', '$gte'));
  } else if (apiQueryString.includes('lt')) {
    apiQuery = JSON.parse(apiQueryString.replace('lt', '$lt'));
  } else if (apiQueryString.includes('lte')) {
    apiQuery = JSON.parse(apiQueryString.replace('lte', '$lte'));
  }
  return dbQuery;
};

const sort = (dbQuery, reqQuery) => {
  if (reqQuery.sort) {
    dbQuery = dbQuery.sort(reqQuery.sort);
  }
  return dbQuery;
};

const paginate = (dbQuery, reqQuery) => {
  const limit = reqQuery.limit * 1 || 1;
  const page = reqQuery.page * 1 || 1;
  const skip = (page - 1) * limit;
  if (reqQuery.limit || reqQuery.page) {
    dbQuery = dbQuery.skip(skip).limit(limit);
  }

  return dbQuery;
};

const projection = (dbQuery, reqQuery) => {
  if (reqQuery.fields) {
    const fields = reqQuery.fields.split(',').join('  ');
    dbQuery = dbQuery.select(fields);
  } else {
    dbQuery = dbQuery.select('-__v');
  }
  return dbQuery;
};

module.exports = {
  filter,
  sort,
  paginate,
  projection,
};
