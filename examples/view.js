;(function(){
  'use strict';

  $(document).on('ready', function(){
  	var state;
    window.router = new recline.URLState();
    var serializedState = window.location.hash.substring(1);

    state = new recline.Model.ObjectState(
      router.transform(serializedState, router.toState)
    );
    state.set('width', window.innerWidth);
    state.set('height', window.innerHeight - 20);

    var model = new recline.Model.Dataset(state.get('model'));
    model.queryState.attributes.size = 10000000;
    model.fetch().done(function(){
      window.chart = new recline.View.nvd3[state.get('graphType')]({
          model: model,
          state: state,
          el: $('#chart'),
      });
      chart.render();
    });
  });

})(window);
