/*jshint multistr:true */

this.recline = this.recline || {};
this.recline.View = this.recline.View || {};

;(function ($, my) {

  /**
   * Cumulative Chart Controls
   */
  my.cumulativeLineChartControls = recline.View.nvd3.BaseControl.extend({});

  /**
   * Discrete Bar Chart Controls
   */
  my.discreteBarChartControls = recline.View.nvd3.BaseControl.extend({
    template: '<div class="form-group checkbox">' +
                  '<label for="control-chart-stagger-labels">' +
                    '<input type="checkbox" id="control-chart-stagger-labels" {{#options.staggerLabels}}checked{{/options.staggerLabels}}/> Stagger Labels' +
                  '</label>' +
              '</div>' +
              '<div class="form-group checkbox">' +
                '<label for="control-chart-show-values">' +
                  '<input type="checkbox" id="control-chart-show-values" {{#options.showValues}}checked{{/options.showValues}}/> Show Values' +
                '</label>' +
              '</div>',
    events: {
      'change input[type="checkbox"]': 'update',
    },
    getUIState:function(){
      var self = this;
      var computedState = {options: {}};
      computedState.options.showValues = self.$('#control-chart-show-values').is(':checked');
      computedState.options.staggerLabels = self.$('#control-chart-stagger-labels').is(':checked');
      return computedState;
    }
  });

  /**
   * Line Chart Controls
   */
  my.lineChartControls = recline.View.nvd3.BaseControl.extend({
    template: ''
  });

  /**
   * Line With Focus Chart Controls
   */
  my.lineWithFocusChartControls = recline.View.nvd3.BaseControl.extend({
    template: ''
  });

  /**
   * Multi Bar Chart Controls
   */
  my.multiBarChartControls = recline.View.nvd3.BaseControl.extend({
    template: '<div class="form-group checkbox">' +
                '<label for="control-chart-stagger-labels">' +
                '<input type="checkbox" id="control-chart-stagger-labels" {{#options.staggerLabels}}checked{{/options.staggerLabels}}/> Stagger Labels' +
                '</label>' +
              '</div>',
    events: {
      'change input[type="checkbox"]': 'update',
    },
    getUIState:function(){
      var self = this;
      var computedState = {options: {}};
      computedState.options.staggerLabels = self.$('#control-chart-stagger-labels').is(':checked');
      return computedState;
    }
  });

  /**
   * Multi Bar Horizontal Chart Controls
   */
  my.multiBarHorizontalChartControls = recline.View.nvd3.BaseControl.extend({
    template: ''
  });

  /**
   * Pie Chart Controls
   */
  my.pieChartControls = recline.View.nvd3.BaseControl.extend({
    template:'<div class="form-group checkbox">' +
                  '<label for="control-chart-donut">' +
                  '<input type="checkbox" id="control-chart-donut" {{#options.donut}}checked{{/options.donut}}/> Donut' +
                  '</label>' +
              '</div>',
    events: {
      'change input[type="checkbox"]': 'update',
    },
    getUIState:function(){
      var self = this;
      var computedState = {options: {}};
      computedState.options.donut = self.$('#control-chart-donut').is(':checked');
      return computedState;
    }
  });

  /**
   * Scatter Chart Controls
   */
  my.scatterChartControls = recline.View.nvd3.BaseControl.extend({
    template: ''
  });

  /**
   * Stacked Chart Controls
   */
  my.stackedAreaChartControls = recline.View.nvd3.BaseControl.extend({
    template: ''
  });

})(jQuery, recline.View.nvd3);