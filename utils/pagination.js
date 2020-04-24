module.exports = (reqPage, filtered) => {
  var page = parseInt(reqPage) || 1;
  var perPage = 5;

  var start = (page - 1) * perPage;
  var end = page * perPage;
  var maxPage = filtered.length;

  filtered = filtered.slice(start, end);

  var pagination = {};
  pagination.page = page;
  if (page < Math.ceil(maxPage/perPage)) pagination.next = page + 1;
  if (page > 1) pagination.prev = page - 1;
  
  return { pagination, filtered };
}