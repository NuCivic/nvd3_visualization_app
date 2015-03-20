;(function ($, my) {
  'use strict';

  my.PublishView = Backbone.View.extend({
    template: '<div class="col-md-12" id="chart-with-controls">' +
                '<div class="form-group">' +
                  '<label for="control-chart-width">Width</label>' +
                  '<input value="{{width}}" type="text" id="control-chart-width" class="form-control" />' +
                '</div>' +
                '<div class="form-group">' +
                  '<label for="control-chart-height">Height</label>' +
                  '<input value="{{height}}" type="text" id="control-chart-height" class="form-control" />' +
                '</div>' +
                '<div class="form-group">' +
                  '<input type="hidden" value="{{serialized}}" class="form-control"/>' +
                '</div>' +
                '<div class="form-group">' +
                  '<label for="control-chart-embed">Embed Code</label>' +
                  '<input id="control-chart-embed" value="{{embedCode}}" class="form-control"/>' +
                '</div>' +
                '<div class="form-group">' +
                  '<label for="control-chart-embed">Url</label>' +
                  '<input value="{{url}}" class="form-control"/>' +
                '</div>' +
              '</div>' +
              '<div  id="chart-viewport"></div>' +
              '<div class="col-md-12" id="controls">' +
                '<div id="prev" class="btn btn-default pull-left">Back</div>' +
              '</div>',
    embedTmpl: '<iframe src="{{{source}}}" width="{{width}}" height="{{height}}" frameBorder="0" style="overflow:hidden" scrolling="no"></iframe>',
    initialize: function(options){
      var self = this;
      self.options = _.defaults(options || {}, self.options);
      self.state = self.options.state;
      self.stepInfo = {
        title: 'Publish and Share',
        name: 'publish'
      };
    },
    events: {
      'change input[type="checkbox"]': 'updateEmbed',
      'blur input[type="text"]': 'updateEmbed',
      'keydown input[type="text"]': 'updateEmbed',
    },
    updateEmbed: function(e){
      var self = this;
      if(e.type === 'keydown' && parseInt(e.keyCode) !== 13) return;
      var serialized = router.getSerializedState(self.state);
      var url = location.protocol + '//' + location.host + location.pathname + 'view.html' + '#' + serialized;

      var iframeHtml = Mustache.render(self.embedTmpl, {
        source: url,
        width: self.$('#control-chart-width').val(),
        height: self.$('#control-chart-height').val()
      });
      self.$('#control-chart-embed').val(iframeHtml);
    },
    render: function(){
      console.log('ChartOptionsView::render');
      var self = this;
      var graphType = self.state.get('graphType');
      var jsonState = self.cleanState(self.state);
      var serialized = router.getSerializedState(jsonState);
      var url = location.protocol + '//' + location.host + location.pathname + 'view.html' + '#' + serialized;

      var iframeHtml = Mustache.render(self.embedTmpl, {
        source: url,
        width: 640,
        height: 480
      });

      var tmplData = {
        state: jsonState,
        width: 640,
        height: 480,
        serialized: serialized,
        url: url,
        embedCode: iframeHtml,
      };

      self.$el.html(Mustache.render(self.template, tmplData));

      self.graph = new recline.View.nvd3[graphType]({
        model: self.state.get('model'),
        state: self.state
      });

      self.assign(self.graph, '#chart-viewport');
      self.$('.chosen-select').chosen({width: '95%'});
    },
    cleanState: function(state){
      var st = state.toJSON();
      st = _.omit(st, [
        'graphTypes',
        'sortFields',
        'fields',
        'xDataTypes',
        'step',
        'height',
        'width',
        'xfields',
        'source',
      ]);
      st = _.omit(st, function(value, key, object){
        return !value;
      });
      return st;
    },
    updateState: function(state, cb){
      cb(state);
    },
    assign: function(view, selector){
      var self = this;
      view.setElement(self.$(selector)).render();
    },
  });

})(jQuery, window);