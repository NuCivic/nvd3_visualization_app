'use strict';
import * as _ from 'lodash';

/**
 * Internal query methods
 **/
let privates = {
  /**
   * SELECT fields
   * Format:
   *   [fieldName1, fieldName2, ...]
   * Returns:
   *  'fieldName1 , fieldName 2 [...]'
   **/
  _fields: (opts) => {
    if (!opts) return '*';
    let sql = [];
    let and = false;
    _.each(opts, (field) => {
      if (and) sql.push(',');
      sql.push(field);
      and = true;
    });
    return privates._composeQuery(sql);
  },

  _filters: (opts) => {
    let sql = ['WHERE'];
    let and = false;
    if (_.isArray(opts)) {
      _.each(opts, (opt) => {
        if (and) sql.push('AND');
        sql = sql.concat(privates._handleFilter(opt));
        and = true;
      });
    } else {
      sql = sql.concat(privates._handleFilter(opts));
    }
    return privates._composeQuery(sql);
  },

  /**
   * Add Filter to Query (range or term)
   * Format: 
   *   range:
   *     { range : {field : { operator : value } } }
   *   term:
   *     { term : { field : value } }
   * 
   * 
   **/
  _handleFilter: (opts) => {
    // @@TODO - we should also check for type property
    let sql = [];
    _.each(opts, (data, type) => {
      type = _.capitalize(type);
      let filterMethod = '_add' + type + 'Filter';
      sql.push(privates[filterMethod](data));
    });

    return sql;
  },

  _addTermFilter: (opts) => {
    let sql = '';
    _.each(opts, (key, val) => {
       sql += val + ' = ' + key;
    });
    return sql;     
  },
  
  _addRangeFilter: (opts) => {
    let sql = [];
    _.each(opts, (data, field) => {
      let op = _.keys(data)[0]; // get operator
      let filterVal = data[op]; // get value
      sql.push(field); // set field
      if (opts.from && opts.to) {
        sql.push([opts.field, '>=' , opts.from, 'AND <=', opts.to]);
      } else if (op) {
        sql.push(privates._rangeOperators[op], filterVal);
      }
    });
    return privates._composeQuery(sql);
  },

  // key elastic search operators to sql operators
  _rangeOperators : {
    gte : '>=',
    lte : '<=',
    gt : '>',
    lt : '<'
  },

  /**
   * Add sort paramters to query
   * Formats:
   * {foo : 'DESC'}
   * {field : 'foo', order : 'ASC'}
   * {field : 'foo' } // defaults to DESC
   * [{foo : 'DESC'}, {field : 'bar', order : 'ASC'}, {field : 'baz'}]
   **/
  _sort: (opts) => {
    if (!opts) return;
    let and = false;
    let sql = ['ORDER BY'];
    // array of sort objects
    if (_.isArray(opts)) {
      _.each(opts, (sortObj) => {
        if (and) sql.push(',');
        if (sortObj.field) {
          sql = sql.concat(privates.__sortLabeled(sortObj));
        } else {
          sql = sql.concat(privates.__sortSimple(sortObj));
        }
        and = true;
      });
    // field syntax
    } else if (opts.field) {
      sql = sql.concat(privates.__sortLabeled(opts));
    // simple syntax
    } else {
      sql = sql.concat(privates.__sortSimple(opts));
    }
    return privates._composeQuery(sql);
  },
  
  // called by _sort()
  // format:
  // {field : 'foo', order: 'DESC' format}
  // {field : 'foo'} // defaults to DESC
  __sortLabeled: (opts) => {
      let sql = [];
      let dir = opts.order || 'DESC';
      sql.push(opts.field);
      sql.push(dir);
      return sql;
  },

  // called by _sort()
  // format:
  // {foo : 'desc'};
  __sortSimple: (opts) => {
    let sql = [];
    let field = _.keys(opts)[0];
    sql.push(field);
    sql.push(opts[field]);
    return sql;
  },

  // @@TODO Implement GROUP BY
  _group: (opts) => {
  },

  _composeQuery: (opts) => {
    var sql = '';
    _.each(opts, (bit, i) => {
      sql += bit;
      if (i < opts.length - 1) {
        sql += ' ';
      }
    });
    return sql;
  }
};

let module = {
  translate : (opts) => {
    let q = opts;
    let fields = privates._fields(q.fields);
    let tableName = q.table;
    let filters = privates._filters(q.filters);
    let sort = privates._sort(q.sort);
    let cartoQ = [];
    
    // build sql array
    cartoQ.push('SELECT');
    cartoQ.push(fields);
    cartoQ.push('FROM');
    cartoQ.push(tableName);

    if (q.filters) {
      cartoQ.push(filters);
    }

    if (q.sort) {
      cartoQ.push(sort);
    }

    if (q.size) {    
      cartoQ.push('LIMIT =');
      cartoQ.push(q.size);
    }

    if (q.from) {
      cartoQ.push('OFFSET =');
      cartoQ.push(q.from);
    }
    return privates._composeQuery(cartoQ);
  },

  privates : privates //include for unit testing
};

export default module;
