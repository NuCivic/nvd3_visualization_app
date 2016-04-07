var recline = recline || {};
var privates = {};
recline.Backend = recline.Backend || {};
recline.Backend.cartodb = recline.Backend.cartodb || {};
(function(my) {

  var Deferred = (typeof jQuery !== "undefined" && jQuery.Deferred) || _.Deferred;

  my._type = 'cartodb';
  my.fetch = function (dataset) {
    var query, sql;
    var dfd = new Deferred();
    // parse user and query from url
    if (dataset.url) {
      dataset.user = privates._parseDatasetUrl(dataset.url);
      query = dataset.url.match(/q=(.*)/g);
      query = decodeURIComponent(query[0].replace('q=',''));
      console.log('cdbF0', query);
    // otherwise create a default query
    } else {
      query = dataset.query || privates._defaultQuery(dataset);
      query.table = dataset.table;
      query = Es2sql.translate(query);
    }
    sql = cartodb.SQL({ user: dataset.user });
    sql.execute(query).done(function (data) {
      console.log('cdf0.6', data);
      var fields = _.keys(data.fields).map(function(val, i) {
        return {id: val};
      });
      console.log('cdbf1', fields, dataset);
      dfd.resolve({
        fields: fields,
        rows:  data.rows,
        useMemoryStore: false
      });
    });
    return dfd.promise();
  };

  my.query = function (queryObj, dataset) {
   console.log('cdbQ0.0',queryObj, dataset);
   var query = {}, sql;
   var dfd = new Deferred();
   // if filters are present we need to do a query call to cartodb
    if (queryObj.filters && queryObj.filters.length > 0) {
      query.size = 100; 
      query.table = dataset.table || privates._parseTableName(dataset.url);
      query.filters = privates._mapQueryFilters(queryObj.filters); // we need to update filter format for Es2sql
      query = Es2sql.translate(query);
    } else  { // otherwise we are probably finishing the fetch call
      query = dataset.url.match(/q=(.*)/g);
      query = decodeURIComponent(query[0].replace('q=',''));
      console.log('cdbF0', query);
   }
   dataset.user = dataset.user ||  privates._parseDatasetUrl(dataset.url);
   console.log('cdbQ1', query);
   sql = cartodb.SQL({ user: dataset.user });
   sql.execute(query).done(function (data) {
     var fields = _.keys(data.fields).map(function(val, i) {
       return {id: val};
     });
     console.log('cdbQ3', data, fields);
     dfd.resolve({
       total: data.total_rows,
       hits: data.rows,
       fields: fields
     });
   });
   return dfd.promise();
 };

  privates._defaultQuery = function (dataset) {
    return {
      table: dataset.table,
      user: dataset.user,
      from: 0,
      size: 100
    }
  };

  // get tablename from url
  privates._parseTableName = function (url) {
    var s = url.match(/q=(.*)/g);
    console.log(s);
    s[0].replace('q=','');
    var reg = /(FROM )([^\s]+)/g;
    var t = reg.exec(decodeURIComponent(url));
    console.log('t',t[2]);
    return t[2];
  };

  // get username from url
  privates._parseDatasetUrl = function (url) {
    var s = url.replace(/http(s*):\/\//g, '');
    s = s.split('.')[0];
    console.log('>>',s);
    return s;
  };

  // filters should match format {type : {term : val}}
  // @@TODO maybe move this to es2sql lib
  privates._mapQueryFilters = function (filters) {
    var mapped = [];
    filters.forEach(function (filter) {
      // if it is defining type we need to remap
      if (filter['type']) {
        var mappedFilter = {};
        var type = filter.type;
        var field = filter.field;
        var term = filter.term;
        mappedFilter[type] = {};
        mappedFilter[type][field] = term;
        console.log('mf', JSON.stringify(mappedFilter));
        mapped.push(mappedFilter);
      } else {
        // otherwise we assume it's ok leave it alone
        mapped.push(filter);
      }
    });
    console.log(mapped);
    return mapped;
  };

  privates._mapQuery = function (query, dataset) {
    // get table name from dataset
    query.size = query.size || 100;
    query.from = query.from || 0;
    if (query.filters && query.filters.length > 0) {
      query.filters = privates._mapQueryFilters(query.filters);
    }
    return Es2sql.translate(query);
  };

})(recline.Backend.cartodb);
